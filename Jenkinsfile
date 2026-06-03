pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = 'riti250'
        DOCKER_HUB_REPO = 'riti250/highwayhub'
        GIT_REPO = 'https://github.com/Ritish2508/highway_hub-next-gen-logistics-platform.git'
    }
    
    parameters {
        choice(name: 'BUILD_TYPE', choices: ['frontend', 'backend', 'both'], description: 'What to build?')
    }
    
    stages {
        stage('🔄 Checkout') {
            steps {
                script {
                    echo "📦 Checking out code from GitHub..."
                    checkout scm
                }
            }
        }
        
        stage('🏗️ Build Frontend') {
            when {
                expression { params.BUILD_TYPE == 'frontend' || params.BUILD_TYPE == 'both' }
            }
            steps {
                script {
                    echo "📦 Building Frontend Docker image..."
                    sh '''
                        cd frontend
                        docker build -t ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} .
                        docker tag ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-frontend:latest
                        echo "✅ Frontend build complete: Build #${BUILD_NUMBER}"
                    '''
                }
            }
        }
        
        stage('🏗️ Build Backend') {
            when {
                expression { params.BUILD_TYPE == 'backend' || params.BUILD_TYPE == 'both' }
            }
            steps {
                script {
                    echo "📦 Building Backend Docker image..."
                    sh '''
                        cd backend
                        docker build -t ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} .
                        docker tag ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER} ${DOCKER_HUB_REPO}-backend:latest
                        echo "✅ Backend build complete: Build #${BUILD_NUMBER}"
                    '''
                }
            }
        }
        
        stage('📤 Push to Docker Hub') {
            steps {
                script {
                    echo "📤 Pushing images to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "Logging into Docker Hub..."
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            
                            if [ "${BUILD_TYPE}" = "frontend" ] || [ "${BUILD_TYPE}" = "both" ]; then
                                echo "Pushing frontend image..."
                                docker push ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}
                                docker push ${DOCKER_HUB_REPO}-frontend:latest
                                echo "✅ Frontend pushed: ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}"
                            fi
                            
                            if [ "${BUILD_TYPE}" = "backend" ] || [ "${BUILD_TYPE}" = "both" ]; then
                                echo "Pushing backend image..."
                                docker push ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}
                                docker push ${DOCKER_HUB_REPO}-backend:latest
                                echo "✅ Backend pushed: ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}"
                            fi
                            
                            docker logout
                            echo "✅ Docker push complete"
                        '''
                    }
                }
            }
        }
        
        stage('🚀 Trigger CD Pipeline') {
            steps {
                script {
                    echo "🔄 Triggering CD Pipeline..."
                    try {
                        build job: 'highwayhub-cd', 
                             parameters: [
                                 string(name: 'BUILD_NUMBER', value: env.BUILD_NUMBER.toString()),
                                 choice(name: 'BUILD_TYPE', value: params.BUILD_TYPE)
                             ],
                             wait: false
                        echo "✅ CD Pipeline triggered"
                    } catch(Exception e) {
                        echo "⚠️  CD Pipeline not triggered (may not exist yet) - Manual update needed"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅✅✅ CI Pipeline SUCCESS!"
            echo "Images pushed: ${DOCKER_HUB_REPO}-frontend:${BUILD_NUMBER}"
            echo "Images pushed: ${DOCKER_HUB_REPO}-backend:${BUILD_NUMBER}"
        }
        failure {
            echo "❌ CI Pipeline FAILED - Check logs above"
        }
        always {
            script {
                echo "📊 Build Summary:"
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Build Type: ${BUILD_TYPE}"
                echo "Status: ${currentBuild.result}"
            }
        }
    }
}
