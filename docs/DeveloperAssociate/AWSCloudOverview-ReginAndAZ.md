AWS Global Infrastructure

Regions
    All around the world
    Names can be us-east-1, eu-west-3..
    Cluster of data centers
    AWS services are region-scoped

    How to choose an AWS Region?
        Depends on
            Compliance with data governance and legal requirement
            Proximity to customer: reduced latency
            Available services with a Region: new services and new features aren't available in every region
            Pricing varies region to region ( transparent in the service pricing page )

Availability Zones
    Each region has many AZs ( usually 3, min  is 3, max is 6)
    separate from each other, so that they're isolated from disasters
    connected with high bandwidth, ultra-low latency networking

AWS points of presence (Edge locations)

Global services
    IAM
    Route 53
    Cloudfront
    WAF
Region-scoped ( most services )
    Amazon EC2
    Elastic Beanstalk
    Lambda
    Rekognition

