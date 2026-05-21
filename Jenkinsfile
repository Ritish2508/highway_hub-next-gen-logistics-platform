@Library('Shared') _
pipeline {
    agent { label 'Node' }

    environment {
        SONAR_HOME = tool "Sonar"
    }

    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: 'v1', description: 'Frontend Docker tag')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: 'v1', description: 'Backend Docker tag')
    }

    stages {

        stage("Workspace cleanup") {
            steps {
                cleanWs()
            }
        }

        stage('Git: Code Checkout') {
            steps {
                script {
                    code_checkout("https://github.com/Ritish2508/highway_hub-next-gen-logistics-plateform.git", "main")
                }
            }
        }

        stage("Trivy: Filesystem scan") {
            steps {
                script {
                    trivy_scan()
                }
            }
        }

        stage("OWASP: Dependency check") {
            steps {
                script {
                    owasp_dependency()
                }
            }
        }

        stage("SonarQube: Code Analysis") {
            steps {
                script {
                    sonarqube_analysis("Sonar", "highwayhub", "highwayhub")
                }
            }
        }

        stage("SonarQube: Quality Gates") {
            steps {
                script {
                    sonarqube_code_quality()
                }
            }
        }

        stage('Environment Setup') {
            parallel {
                stage("Backend env setup") {
                    steps {
                        dir("Automations") {
                            sh "bash updatebackendnew.sh"
                        }
                    }
                }

                stage("Frontend env setup") {
                    steps {
                        dir("Automations") {
                            sh "bash updatefrontendnew.sh"
                        }
                    }
                }
            }
        }

        stage("Docker: Build Images") {
            steps {
                script {
                    dir('backend') {
                        docker_build(
                            "highwayhub-backend-beta",
                            "${params.BACKEND_DOCKER_TAG}",
                            "riti250"
                        )
                    }

                    dir('frontend') {
                        docker_build(
                            "highwayhub-frontend-beta",
                            "${params.FRONTEND_DOCKER_TAG}",
                            "riti250"
                        )
                    }
                }
            }
        }

        stage("Docker: Push Images") {
            steps {
                script {
                    docker_push(
                        "highwayhub-backend-beta",
                        "${params.BACKEND_DOCKER_TAG}",
                        "riti250"
                    )

                    docker_push(
                        "highwayhub-frontend-beta",
                        "${params.FRONTEND_DOCKER_TAG}",
                        "riti250"
                    )
                }
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: '*.xml', followSymlinks: false

            build job: "HighwayHub-CD",
            parameters: [
                string(
                    name: 'FRONTEND_DOCKER_TAG',
                    value: "${params.FRONTEND_DOCKER_TAG}"
                ),
                string(
                    name: 'BACKEND_DOCKER_TAG',
                    value: "${params.BACKEND_DOCKER_TAG}"
                )
            ]
        }
    }
}