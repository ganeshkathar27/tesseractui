set -e;
echo "##### Installing packages..."
sudo yum update -y
sudo yum install git -y

echo "##### Checking out repository..."
eval "$(ssh-agent -s)"
ssh-add ./id_rsa

if [ ! -d "tesseractui" ]; then
    git clone git@github.com:abistarun/tesseractui.git    
fi

cd tesseractui
git pull --rebase

echo "##### Setup properties..."
cp ../firebase-api-key.ts ./angular-app/Tesseract/src/environments/firebase-api-key.ts

echo "#### Build and start App..."
docker system prune --volumes -f
docker-compose -f docker-compose-prod.yml up -d --build