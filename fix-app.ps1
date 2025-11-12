# PowerShell script to fix App.tsx stale data loading issue

$filePath = "d:\DevProjects\src\App.tsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Fix #1: Replace initializeApp section (lines 44-107)
$oldBlock1 = @"
          // Set global username for auto-save functionality
          `(window as any`).__currentUsername = user.username;
          console.log`('🔑 Restored current username for auto-save'`);
          
          // Restore character data if available
          if `(user.characterData`)"@

$newBlock1 = @"
          // Set global username for auto-save functionality
          `(window as any`).__currentUsername = user.username;
          console.log`('Restored current username for auto-save'`);
          
          // CRITICAL FIX: Load from LIVE storage keys instead of stale user.characterData
          console.log```(`Loading LIVE data for ```${user.username}...```)``;
          
          // Load player data from live storage
          const playerLoaded = usePlayerStore.getState`(`).loadPlayer`(user.username`);
          console.log`(playerLoaded ? ``Loaded player data`` : ``New character```);
          
          // Load world state from live storage
          const worldLoaded = useWorldStore.getState`(`).loadWorld`(user.username`);
          if `(!worldLoaded`) {
            useWorldStore.getState`(`).resetWorld`(`);
          }
          console.log`(worldLoaded ? ``Loaded world state`` : ``New world```);
          
          // Load quest state from live storage
          const questLoaded = useQuestStore.getState`(`).loadQuests`(user.username`);
          console.log`(questLoaded ? ``Loaded quests`` : ``New quests```);
          
          // Load achievements from live storage
          useAchievementStore.getState`(`).loadAchievements`(user.username`);
          console.log```(`Loaded achievements```)``;
          
          console.log```(`All data loaded from LIVE storage keys```)``;
        } catch `(error`) {
          console.error`('Failed to parse user data:', error`);
          localStorage.removeItem`('current_user'`);
        }
      }

      setIsLoading`(false`)"@

# This is complex - let me use line-based replacement instead
$lines = Get-Content $filePath -Encoding UTF8
$newLines = @()
$skipUntil = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($skipUntil -gt 0 -and $i -lt $skipUntil) {
        continue
    }
    
    # Check for start of block to replace (line ~40-41)
    if ($lines[$i] -match "Set global username for auto-save functionality" -and $i -gt 30 -and $i -lt 50) {
        # Add the new code
        $newLines += "          // Set global username for auto-save functionality"
        $newLines += "          (window as any).__currentUsername = user.username;"
        $newLines += "          console.log('Restored current username for auto-save');"
        $newLines += "          "
        $newLines += "          // CRITICAL FIX: Load from LIVE storage keys instead of stale user.characterData"
        $newLines += "          console.log(```Loading LIVE data for ```${user.username}...```);"
        $newLines += "          "
        $newLines += "          // Load player data from live storage"
        $newLines += "          const playerLoaded = usePlayerStore.getState().loadPlayer(user.username);"
        $newLines += "          console.log(playerLoaded ? ```Loaded player data`` : ```New character```);"
        $newLines += "          "
        $newLines += "          // Load world state from live storage"
        $newLines += "          const worldLoaded = useWorldStore.getState().loadWorld(user.username);"
        $newLines += "          if (!worldLoaded) {"
        $newLines += "            useWorldStore.getState().resetWorld();"
        $newLines += "          }"
        $newLines += "          console.log(worldLoaded ? ```Loaded world state`` : ```New world```);"
        $newLines += "          "
        $newLines += "          // Load quest state from live storage"
        $newLines += "          const questLoaded = useQuestStore.getState().loadQuests(user.username);"
        $newLines += "          console.log(questLoaded ? ```Loaded quests`` : ```New quests```);"
        $newLines += "          "
        $newLines += "          // Load achievements from live storage"
        $newLines += "          useAchievementStore.getState().loadAchievements(user.username);"
        $newLines += "          console.log(```Loaded achievements```);"
        $newLines += "          "
        $newLines += "          console.log(```All data loaded from LIVE storage keys```);"
        
        # Skip until we find the closing of the old block
        # Find "} catch (error) {"
        for ($j = $i + 1; $j -lt $lines.Count; $j++) {
            if ($lines[$j] -match "^\s*}\s*catch\s*\(error\)") {
                $skipUntil = $j
                break
            }
        }
        $i++
        continue
    }
    
    $newLines += $lines[$i]
}

# Write back
$newLines | Set-Content $filePath -Encoding UTF8
Write-Host "Fixed initializeApp section in App.tsx"
