# Food Trucks

This project will create a serverless API that helps you decide where you will eat!

## Why?

This project was built in order to display my technical acumen, in preparation for an interview.

## What?

A serverless REST API on AWS. It utilizes TypeScript for application code, and Terraform for IaC.

## How?

Here are the usage instructions

### Required Prerequisites

- Terraform 1.3.0
- Node 16

### Optional Prerequisites

- tfswitch
- nvm

### Deployment

- Run a Terraform Plan: `npm run tf:plan`
- Run a Terraform Apply: `npm run tf:apply`

### The API

There is currently a single endpoint. It will help you locate the nearest food truck in relation to your current location.

```
curl -H "Content-Type: application/json" -X POST -d '{ "location": { "latitude": 37.774929, "longitude": -122.419418 }}' <terraform output url here>/v1/food-trucks/nearest
```

It should output something like this

```json
{
  "locationid": "773095",
  "Applicant": "Athena SF Gyro",
  "FacilityType": "Push Cart",
  "cnn": "30747000",
  "LocationDescription": "MARKET ST: 11TH ST intersection",
  "Address": "10 SOUTH VAN NESS AVE",
  "blocklot": "3506004",
  "block": "3506",
  "lot": "004",
  "permit": "15MFF-0145",
  "Status": "REQUESTED",
  "FoodItems": "Gyro pita bread (Lamb or chicken): lamb over rice: chicken over rice: chicken biryani rice: soft drinks",
  "X": "6006927.466",
  "Y": "2110076.439",
  "Latitude": 37.77425926306004,
  "Longitude": -122.41948598839828,
  "Schedule": "http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=15MFF-0145&ExportPDF=1&Filename=15MFF-0145_schedule.pdf",
  "dayshours": "We/Th/Fr:6AM-6PM",
  "NOISent": "",
  "Approved": "",
  "Received": "20150901",
  "PriorPermit": "0",
  "ExpirationDate": "",
  "Location": "(37.77425926306004, -122.41948598839828)",
  "Fire Prevention Districts": "8",
  "Police Districts": "2",
  "Supervisor Districts": "9",
  "Zip Codes": "28853",
  "Neighborhoods (old)": "19",
  "distance": 0.07470710740474633,
  "humanReadableDistance": "0.07km"
}
```

## What was left undone?

There would normally be so many things left to do... Here is a quick list for the sake of discussion.

- Load balancer
- DNS
- Use an API or persist CSV related data to a data store
- CI/CD
- General testing
- API documentation
- Lambda artifact versioning
- Encryption
  - Bucket
  - Log groups
  - Lambda
- Bucket lifecycle policy
