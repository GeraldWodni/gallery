podTemplate(yaml: '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildah
    image: quay.io/buildah/stable:latest
    command:
    - sleep
    args:
    - 99d
    env:
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
''') {
    node(POD_LABEL) {
        stage("checkout") {
            checkout scm
        }
        stage("dockerlogin") {
            container('buildah') {
                sh 'echo "${REG_PASSWORD}" | buildah login -u ${REG_USERNAME} --password-stdin ${REG_HOSTNAME}'
            }
        }
        stage("dockerfile") {
            container('buildah') {
                sh 'buildah version && DOCKER_BUILDKIT=1 \
                buildah build \
                --build-arg REG_HOSTNAME=${REG_HOSTNAME} \
                --build-arg REG_FOLDER=${REG_FOLDER} \
                -t ${REG_HOSTNAME}/${REG_FOLDER}/gallery:b${BUILD_NUMBER} \
                -t ${REG_HOSTNAME}/${REG_FOLDER}/gallery:latest .'
            }
        }
        stage("dockerpush") {
            container('buildah') {
                sh 'buildah push ${REG_HOSTNAME}/${REG_FOLDER}/gallery:b${BUILD_NUMBER}'
                sh 'buildah push ${REG_HOSTNAME}/${REG_FOLDER}/gallery:latest'
            }
        }
        stage("deploy") {
            container('buildah') {
                sh 'wget http://deployer/patch-image/kernjs/gallery/${BUILD_NUMBER}'
            }
        }
    }
}
