#!/usr/bin/pwsh

$items = Get-Content ./data_cleveland.csv | ConvertFrom-Csv

$items

$mitems = $items |%{
  @{
    'group'= $_.group
    'values'= @(
      @{ value = [float]$_.value1 }
      @{ value = [float]$_.value2 }
    )
  }
}
$mitems | ConvertTo-Json -Depth 10 

$mitems | ConvertTo-Json -Depth 10 > data_cleveland.json
