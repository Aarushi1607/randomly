
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install, Test and Lint') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE:/app" \
                      -w /app \
                      node:24-alpine \
                      sh -c 'npm ci && npm test && npm run lint'
                '''
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-push',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    ),
                    string(
                        credentialsId: 'supabase-url',
                        variable: 'VITE_SUPABASE_URL'
                    ),
                    string(
                        credentialsId: 'supabase-anon-key',
                        variable: 'VITE_SUPABASE_ANON_KEY'
                    )
                ]) {
                    sh '''
                        set +x
                        IMAGE="$DOCKERHUB_USER/randomly"

                        docker build \
                          --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
                          --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
                          -t "$IMAGE:$BUILD_NUMBER" \
                          -t "$IMAGE:latest" .

                        echo "$DOCKERHUB_TOKEN" | docker login \
                          -u "$DOCKERHUB_USER" --password-stdin

                        docker push "$IMAGE:$BUILD_NUMBER"
                        docker push "$IMAGE:latest"

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded: tests passed and Docker images were pushed.'
        }
        failure {
            echo 'Pipeline failed. Check the stage console output.'
        }
    }
}
