podTemplate(yaml: '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:stable
    command:
    - sleep
    args:
    - 99d
    env:
      - name: DOCKER_HOST
        value: tcp://localhost:2375
      - name: REG_USERNAME
        valueFrom:
          secretKeyRef:
            name: jenkins-registry-login
            key: username
      - name: REG_PASSWORD
        valueFrom:
          secretKeyRef:
            name: jenkins-registry-login
            key: password
      - name: REG_HOSTNAME
        valueFrom:
          secretKeyRef:
            name: jenkins-registry-login
            key: hostname
      - name: REG_FOLDER
        valueFrom:
          secretKeyRef:
            name: jenkins-registry-login
            key: folder
  - name: docker-daemon
    image: docker:stable-dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
''') {
    node(POD_LABEL) {
        stage("checkout") {
            checkout scm
        }
        stage("dockerlogin") {
            container('docker') {
                sh 'echo "${REG_PASSWORD}" | docker login -u ${REG_USERNAME} --password-stdin ${REG_HOSTNAME}'
            }
        }
        stage("dockerfile") {
            container('docker') {
                sh 'docker version && DOCKER_BUILDKIT=1 \
                docker build --progress plain \
                --build-arg REG_HOSTNAME=${REG_HOSTNAME} \
                --build-arg REG_FOLDER=${REG_FOLDER} \
                -t ${REG_HOSTNAME}/${REG_FOLDER}/gallery:b${BUILD_NUMBER} \
                -t ${REG_HOSTNAME}/${REG_FOLDER}/gallery:latest .'
            }
        }
        stage("dockerpush") {
            container('docker') {
                sh 'docker push ${REG_HOSTNAME}/${REG_FOLDER}/gallery:b${BUILD_NUMBER}'
                sh 'docker push ${REG_HOSTNAME}/${REG_FOLDER}/gallery:latest'
            }
        }
        stage("deploy") {
            container('docker') {
                sh 'wget http://deployer/patch-image/kernjs/gallery/${BUILD_NUMBER}'
            }
        }
    }
}
