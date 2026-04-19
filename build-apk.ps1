$ErrorActionPreference = 'Stop'
$zipPath = "$PWD\jdk17.zip"
$extractPath = "$PWD\jdk17"

if (-not (Test-Path "$extractPath")) {
    Write-Host "Downloading JDK 17 (this may take a minute)..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse" -OutFile $zipPath
    
    Write-Host "Extracting JDK 17..."
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    Remove-Item $zipPath
}

$jdkDir = Get-ChildItem -Path $extractPath -Directory | Select-Object -First 1
Write-Host "Setting JAVA_HOME to $($jdkDir.FullName)"
$env:JAVA_HOME = $jdkDir.FullName

Write-Host "Building APK..."
cd android
.\gradlew.bat assembleRelease
