#!/bin/bash
cd ~/YANKA-AI-Edu-Assistant && git pull origin main
source yanka/Webapp/backend/venv/bin/activate
pip install -r yanka/Webapp/backend/requirements.txt
sudo systemctl restart yanka
