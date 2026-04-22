$proc = Start-Process -FilePath "npx" -ArgumentList "next","start","-p","3000" -WorkingDirectory "C:\Users\probook\Desktop\ZEUS_AGENTIA_V2" -PassThru -WindowStyle Hidden
Write-Host "Started process $($proc.Id)"
Start-Sleep -Seconds 5
Test-NetConnection -ComputerName localhost -Port 3000