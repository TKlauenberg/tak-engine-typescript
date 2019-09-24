node {
    cleanWs()
    checkout scm
    docker.image('node').inside {
        stage('Build') {
            sh 'npm i'
            sh 'npm run build'
            sh 'npm run build-test'
        }
        stage('Test') {
            sh label: 'Run Test', returnStatus: true, script: 'npm run test'
        }
    }
    stage('Generate Living Documentation'){
        cucumber failedFeaturesNumber: -1, failedScenariosNumber: -1, failedStepsNumber: -1, fileIncludePattern: '**/cucumber.json', jsonReportDirectory: 'features', pendingStepsNumber: -1, skippedStepsNumber: -1, sortingMethod: 'ALPHABETICAL', undefinedStepsNumber: -1
        livingDocs featuresDir: 'features', format: 'ALL', hideFeaturesSection: true
    }
}