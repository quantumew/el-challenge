data "archive_file" "lambda" {
  type = "zip"

  source_dir  = "${path.module}/../build/src"
  output_path = "${path.module}/../build/lambda.zip"
}

resource "aws_s3_object" "lambda" {
  bucket = aws_s3_bucket.project_bucket.id

  key    = "deployment/lambda.zip"
  source = data.archive_file.lambda.output_path

  etag = filemd5(data.archive_file.lambda.output_path)
}

resource "aws_lambda_function" "lambda" {
  function_name = "nearest-trucks"

  s3_bucket = aws_s3_bucket.project_bucket.id
  s3_key    = aws_s3_object.lambda.key

  runtime = "nodejs16.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout          = 60

  environment {
    variables = {
      DATA_BUCKET = aws_s3_bucket.project_bucket.id
      DATA_KEY    = aws_s3_object.csv.id
    }
  }

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "lambda" {
  name = "/aws/lambda/${aws_lambda_function.lambda.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "bucket_policy" {
  name        = "bucket_policy"
  path        = "/"
  description = "Policy to allow retrieval of food truck CSV data"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:Get*",
          "s3:List*",
        ]
        Effect   = "Allow"
        Resource = [aws_s3_bucket.project_bucket.arn, "${aws_s3_bucket.project_bucket.arn}/*"]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_bucket_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.bucket_policy.arn
}