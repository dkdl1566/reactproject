const apikey = '0dc36c1c-e0b0-41c3-a26f-9ca7c4d6f4a8'

export const getCatBreeds = async (currentPage, limit = 5) => {
  if (typeof currentPage !== 'number') {
    throw new Error('getCatBreeds 함수의 currentPage 파라미터는 number 이어야 합니다.')
  }
  if (typeof limit !== 'number') {
    throw new Error('getCatBreeds 함수의 limit 파라미터는 number 이어야 합니다.')
  }

  const reponse = await fetch(`https://api.thecatapi.com/v1/breeds?page=${currentPage}&limit=${limit}`, {
    headers: {
      'x-api-key': apikey,
    },
  })
  const breeds = await reponse.json()

  return breeds
}
