chmod 400 ./Resources/Tesseract.pem
scp -i "./Resources/Tesseract.pem" ./Resources/git-ssh-id_rsa ec2-user@ec2-15-222-8-179.ca-central-1.compute.amazonaws.com:./id_rsa
scp -i "./Resources/Tesseract.pem" ./Resources/git-ssh-id_rsa.pub ec2-user@ec2-15-222-8-179.ca-central-1.compute.amazonaws.com:./id_rsa.pub
scp -i "./Resources/Tesseract.pem" ./Resources/firebase-api-key.ts ec2-user@ec2-15-222-8-179.ca-central-1.compute.amazonaws.com:./firebase-api-key.ts
cat ./Resources/run-deployment.sh | ssh -i "./Resources/Tesseract.pem" ec2-user@ec2-15-222-8-179.ca-central-1.compute.amazonaws.com sh

echo "############################ Deployment completed successfully ############################"