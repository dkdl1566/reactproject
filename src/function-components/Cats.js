import '../components/Cats.scss'

import { useState, useCallback, useEffect, useMemo } from 'react'

import LoadingIndicator from './LoadingIndicator'
import HeaderButtonGroup from './HeaderButtonGroup'

import { catApiUrl, catHeaders } from '../utils/api'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useFetch } from '../hooks/useFetch'
const Cats = () => {
  const [time, setTime] = useState(0)
  const [storedBreeds, storeBreeds] = useLocalStorage('breeds', [])
  const [storedPages, storePages] = useLocalStorage('fetchedPages', [])
  const [currentPage, setCurrentPage] = useState(storedPages.length !== 0 ? storedPages[storedPages.length - 1] : 1)

  const params = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
    }),
    [currentPage]
  )
  const {
    data: breeds,
    isLoading,
    hasError,
    error,
  } = useFetch(
    `${catApiUrl}/breeds`,
    params,
    catHeaders,
    storedBreeds,
    storeBreeds,
    newData => {
      storeBreeds(storedBreeds.concat(newData))
    },
    () => {
      const hasFetched = storePages.includes(currentPage)

      if (hasFetched) {
        storePages(storedPages.concat(currentPage))
      }
      return !hasFetched
    }
  )

  useEffect(() => {
    console.log(breeds)
    storeBreeds(storedBreeds.concat(breeds))
  }, [breeds])

  const handlePreviousPage = useCallback(() => {
    if (currentPage <= 1) {
      return
    }

    setCurrentPage(previousPage => previousPage - 1)
  }, [currentPage])

  const handleNextPage = useCallback(() => {
    setCurrentPage(previousPage => previousPage + 1)
  }, [])

  // useEffect(() => {
  //   if (storedPages.includes(currentPage)) {
  //     return
  //   }

  //   storePages(storedPages.concat(currentPage))
  // }, [currentPage])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(previousTime => previousTime + 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="Cats">
      {!hasError ? (
        <>
          <p>?????????: {time}</p>
          <p>?????? ?????????: {currentPage}</p>
          <HeaderButtonGroup onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} />
          <LoadingIndicator isLoading={isLoading} />
          <ul>
            {breeds.map((breed, index) => (
              <li className="Cat" key={`${breed.id}-${index}`}>
                <span>Name: {breed.name}</span>
                <span>Origin: {breed.origin}</span>
                <span>Description: {breed.description}</span>
                <span>
                  Wiki:{' '}
                  <a href={breed.wikipedia_url} target="_blank">
                    {breed.wikipedia_url}
                  </a>
                </span>
                <img className="Image" src={breed.image ? breed.image.url : null} />
              </li>
            ))}
          </ul>
          <LoadingIndicator isLoading={isLoading} />
          <HeaderButtonGroup onPreviousPage={handlePreviousPage} onNextPage={handleNextPage} />
        </>
      ) : (
        <p>
          ???????????? ???????????? ?????? ????????? ??????????????????.
          <br />
          {JSON.stringify(error, null, 2)}
        </p>
      )}
    </div>
  )
}

export default Cats
