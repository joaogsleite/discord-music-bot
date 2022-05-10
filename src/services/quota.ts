const MAX_VALUE = 400

interface IPlayer {
  id: string
  quota: number
}

let players: IPlayer[] = []

function generateValue(value: number, iteration: number) {
  if (value >= MAX_VALUE) {
    value = MAX_VALUE - iteration
  } else {
    value = value - 1
  }
  return Math.floor(value) + (new Date().getDate()/100)
}

function getAvailableQuota() {
  const quotas = players.map((player) => {
    return player.quota
  }).sort((a, b) => {
    return b - a
  })
  if (quotas.length >= 2) {
    return quotas[1] as number
  } else {
    return 0
  }
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  let currentIndex = newArray.length
  let randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

export function generatePlays() {
  const result = []
  let availableQuota = getAvailableQuota()
  let iteration = 1
  while (availableQuota >= 100) {
    const value = generateValue(availableQuota, iteration)
    const availablePlayers = shuffle(players.filter((player) => {
      return player.quota >= value
    }))
    for (let i=0; i<availablePlayers.length; i++) {
      if (availablePlayers[i].quota >= value) {
        availablePlayers[i].quota = availablePlayers[i].quota - value
      }
    }
    if (availablePlayers.length < 2) {
      break
    } else {
      availablePlayers.push(availablePlayers[0])
      result.push({ 
        value,
        players: availablePlayers.map((p) => p.id)
      })
    }
    availableQuota = getAvailableQuota()
    iteration++
  }
  players = []
  return result
}

export function setQuota(userId: string, quota: number) {
  let playerIndex = players.findIndex((player) => player.id === userId)
  if (playerIndex === -1) {
    players.push({ id: userId, quota })
  } else {
    players[playerIndex].quota = quota
  }
}
