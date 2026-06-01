pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = 'riti250'
        DOCKER_HUB_REPO = 'riti250/highwayhub'
        GIT_REPO = 'https://github.com/Ritish2508/highway_hub-next-gen-logistics-platform.git'
        SONARQUBE_PROJECT_KEY = 'highwayhub'
    }
    
    parameters {
        choice(name: 'BUILD_TYPE', choices: ['frontend', 'backend', 'both'], description: 'What to build?')
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "📦 Checking out code..."
                    checkout scm
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "📊 Running SonarQube analysis..."
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=http://sonarqube-service:9000 \
                                -Dsonar.login=${SONARQUBE_TOKEN}
                        '''
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            when {
                expression { params.BUILD_TYPE == 'frontend' || params.BUILD_TYPE == 'both' }
            }
            steps {
                script {
                    echo "🏗️ Building Frontend..."
                    sh '''
                        cd frontend
                        docker build -t ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} .
                        docker tag ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-frontend:latest
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            when {
                expression { params.BUILD_TYPE == 'backend' || params.BUILD_TYPE == 'both' }
            }
            steps {
                script {
                    echo "🏗️ Building Backend..."
                    sh '''
                        cd backend
                        docker build -t ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} .
                        docker tag ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-backend:latest
                    '''
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "📤 Pushing to Docker Hub..."
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
    }
    
    post {
        success {
            echo "✅ Build successful!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}