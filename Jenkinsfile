pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = 'riti250'
        DOCKER_HUB_REPO = 'riti250/highwayhub'
    }
    
    parameters {
        choice(name: 'BUILD_TYPE', choices: ['frontend', 'backend', 'both'])
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=highwayhub \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://sonarqube-service:9000 \
                            -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }
        
        stage('Build Frontend') {
            when { expression { params.BUILD_TYPE == 'frontend' || params.BUILD_TYPE == 'both' } }
            steps {
                sh '''
                    cd frontend
                    docker build -t ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} .
                    docker tag ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-frontend:latest
                '''
            }
        }
        
        stage('Build Backend') {
            when { expression { params.BUILD_TYPE == 'backend' || params.BUILD_TYPE == 'both' } }
            steps {
                sh '''
                    cd backend
                    docker build -t ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} .
                    docker tag ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-backend:latest
                '''
            }
        }
        
        stage('Push Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        
                        if [ "${BUILD_TYPE}" = "frontend" ] || [ "${BUILD_TYPE}" = "both" ]; then
                            docker push ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}
                            docker push ${DOCKER_HUB_REPO}-frontend:latest
                        fi
                        
                        if [ "${BUILD_TYPE}" = "backend" ] || [ "${BUILD_TYPE}" = "both" ]; then
                            docker push ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}
                            docker push ${DOCKER_HUB_REPO}-backend:latest
                        fi
                        
                        docker logout
                    '''
                }
            }
        }
    }
    
    post {
        success { echo "✅ Build Success!" }
        failure { echo "❌ Build Failed!" }
    }
}