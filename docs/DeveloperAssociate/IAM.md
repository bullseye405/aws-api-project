IAM: Users & Group
    Identity and Access Management, Global service
    Root account created by default, shouldn't be used or shared
    Users are people within your organization, and can be grouped
        Org with 6 people
            Dev groups 3 users
            Operations group 2 users
    Users don't have to belong to a group, and user can belong to multiple groups

IAM: Permissions
    Users or groups can be assigned JSON documents called policies
    Least privilege principle: don't give more permissions that a user needs

IAM: Policies
    Group policies
    Inline policies

    Structure
        Version no
        Id
        Statement: one or more individual statements
            Sid
            Effect: Allow , Deny
            Principal: account/user/role to which this policy applied to
            Action: list of action this policy allows or denies
            Resource
            Condition

IAM - Password Policy
    Strong passwords
        - min length
        - require specific character types
            uppercase
            lowercase
            numbers
            non-alphanumeric
    Allow all IAM users to change their own passwords
    Require users to change password after some time
    Prevent password re-use

    Multi Factor Authentication - MFA
        - protect at least Root accounts and IAM users
        - MFA = password + security device you own

        Devices
            - Virtual MFA device
            - Universal 2nd Factor (U2F) Security Key
            - Hardware Key Fob MFA Device

IAM Roles for services
    - some services need to perform actions, so we assign permission to those services with IAM Roles
    - EG: EC2 Instance, Lambda function

IAM security tools
    - IAM Credentials report ( account-level)
    - IAM Access Advisor ( user-level )

IAM Best Practices
    - don't use the root account except for AWS account setup
    - assign users to groups and assign permission to groups
    - strong password policy
    - use and enforce the use of MFA
    - create and use Roles for giving permission to AWS services
    - use access keys for programmatic access ( CLI/ SDK )
    - audit permission of your account using IAM Credentials Report & IAM Access Advisor
    - never share IAM users & Access Keys

Shared Responsibility Model for IAM
    - AWS
        - Infrastructure
        - Configuration and vulnerability analysis
        - Compliance validation
    - You
        - Users, Groups, Roles, Policies management and monitoring
        - Enable MFA on all accounts
        - Rotate all your keys often
        - Use IAM tools to apply appropriate permission
        - Analyze access pattern and review permissions

    