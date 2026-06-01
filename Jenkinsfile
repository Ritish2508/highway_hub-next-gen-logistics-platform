pipeline {
    agent any

    environment {
        SONAR_HOME = tool "SonarQube Scanner"
        DOCKERHUB_USERNAME = "riti250"
        FRONTEND_IMAGE = "highwayhub-frontend-beta"
        BACKEND_IMAGE = "highwayhub-backend-beta"
    }

    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: 'v1', description: 'Frontend Docker tag')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: 'v1', description: 'Backend Docker tag')
    }

    stages {

        stage("Workspace Cleanup") {
            steps {
                cleanWs()
            }
        }

        stage("Git: Code Checkout") {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/Ritish2508/highway_hub-next-gen-logistics-platform'
            }
        }

        stage("Trivy: Filesystem Scan") {
            steps {
                sh "trivy fs --format table -o trivy-report.xml . || true"
            }
        }

        stage("OWASP: Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format XML --out .', odcInstallation: 'OWASP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage("SonarQube: Code Analysis") {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        $SONAR_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=highwayhub \
                        -Dsonar.projectName=highwayhub \
                        -Dsonar.sources=.
                    """
                }
            }
        }

        stage("SonarQube: Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("Docker: Build Images") {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"

                        dir('backend') {
                            sh "docker build -t ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:${params.BACKEND_DOCKER_TAG} ."
                        }

                        dir('frontend') {
                            sh "docker build -t ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:${params.FRONTEND_DOCKER_TAG} ."
                        }
                    }
                }
            }
        }

        stage("Docker: Push Images") {
            steps {
                script {
                    sh "docker push ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:${params.BACKEND_DOCKER_TAG}"
                    sh "docker push ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:${params.FRONTEND_DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            node('built-in') {
                archiveArtifacts artifacts: '*.xml', allowEmptyArchive: true
            }
        }
        success {
            echo "Build successful!"
        }
        failure {
            echo "Build failed!"
        }
    }
}