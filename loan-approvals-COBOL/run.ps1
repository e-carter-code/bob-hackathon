$ErrorActionPreference = "Stop"

$compiler = Get-Command cobc -ErrorAction SilentlyContinue
$msysCobc = "C:\msys64\ucrt64\bin\cobc.exe"
$msysBash = "C:\msys64\usr\bin\bash.exe"
$compilerPath = $null
$runtimeDlls = @(
    "libcob-4.dll",
    "libgmp-10.dll",
    "libdb-6.2.dll",
    "libiconv-2.dll",
    "libintl-8.dll",
    "libjson-c-5.dll",
    "libncursesw6.dll",
    "libwinpthread-1.dll",
    "libgcc_s_seh-1.dll",
    "zlib1.dll",
    "libzstd.dll",
    "libbz2-1.dll",
    "libcharset-1.dll",
    "libxml2-16.dll"
)

if (-not $compiler -and -not (Test-Path $msysCobc)) {
    Write-Host "GnuCOBOL compiler 'cobc' was not found on PATH."
    Write-Host "Install GnuCOBOL, then run this script again."
    exit 1
}

if ((Test-Path $msysCobc) -and (Test-Path $msysBash)) {
    $projectPath = (Get-Location).Path -replace "\\", "/"
    if ($projectPath -match "^([A-Za-z]):/(.*)$") {
        $drive = $matches[1].ToLower()
        $rest = $matches[2]
        $projectPath = "/$drive/$rest"
    }

    & $msysBash -lc "export PATH=/ucrt64/bin:`$PATH; export COB_CONFIG_DIR=/ucrt64/share/gnucobol/config; cd '$projectPath' && cobc -x -free -I copy -o loan-approval.exe src/LNMAIN.cbl src/LNRULES.cbl src/LNRATE.cbl && ./loan-approval.exe"
    foreach ($dll in $runtimeDlls) {
        Copy-Item -Path "C:\msys64\ucrt64\bin\$dll" -Destination "." -Force
    }
    exit $LASTEXITCODE
}

$compilerPath = $compiler.Source
& $compilerPath -x -free -I copy -o loan-approval.exe src\LNMAIN.cbl src\LNRULES.cbl src\LNRATE.cbl
foreach ($dll in $runtimeDlls) {
    Copy-Item -Path "C:\msys64\ucrt64\bin\$dll" -Destination "." -Force -ErrorAction SilentlyContinue
}
.\loan-approval.exe
