# StudySmart Backend V2
## How to Deploy 
1. First zip your code package, preferably using command line `zip -xsrf * `. Currently, we do not include the .ebextensions directory. Be careful with this as it is hidden when normally viewed in terminal because it begins with a dot. Use `ls -a` to check that it is not included. Most recent master branch shuold not include it.

2. On AWS, go to Elastic Beanstalk (WEST 1) >> Studysmarttest-env (or production environment) >> upload and deploy and upload the zip file and name the version appropriately. 

To roll back to a previous deployment version, in the side bar under "StudySmartServer", click "Application Versions", check the box of the version to roll back to, click the "Actions" drop down in the top right, "Deploy" and select an environment.
