resource "aws_s3_bucket" "project_bucket" {
  bucket = "adg-el-challenge"
}

resource "aws_s3_bucket_acl" "project_bucket" {
  bucket = aws_s3_bucket.project_bucket.id
  acl    = "private"
}

resource "aws_s3_object" "csv" {
  bucket = aws_s3_bucket.project_bucket.id

  key    = "data.csv"
  source = "${path.module}/../fixtures/data.csv"

  etag = filemd5(data.archive_file.lambda.output_path)
}
