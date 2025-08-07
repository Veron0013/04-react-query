import { useEffect, useState } from "react"
import { getMovieById, getMovies, type SearchParams } from "../../services/movieService"
import MovieGrid from "../MovieGrid/MovieGrid"
import { Toaster } from "react-hot-toast"

import SearchBar from "../SearchBar/SearchBar"
import toastMessage, { MyToastType } from "../../services/messageService"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"

import css from "./App.module.css"
import MovieModal from "../MovieModal/MovieModal"
import { useLanguage } from "../LanguageContext/LanguageContext"
//import { useLocalStorage } from "@uidotdev/usehooks"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"
import ScrollUp from "../ScrollUp/ScrollUp"
import { SCROLL_THRESHOLD, SEARCH_URL, TRANDING_URL } from "../../services/vars"

function App() {
	const [movie_id, setMovieId] = useState(0)
	//const [varIsError, setIsError] = useState(false)
	//const [storageQuery, setStorageQuery] = useLocalStorage("storageQuery", "")
	const [storageQuery, setStorageQuery] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isTrending, setisTrending] = useState(true)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [isScrollUp, setScrollUp] = useState(false)

	const { language, translationTexts } = useLanguage()

	const { data, isLoading, isError } = useQuery({
		queryKey: ["searchQuery", currentPage, storageQuery, isTrending, language],
		queryFn: async () => fetchQueryData(storageQuery),
		placeholderData: keepPreviousData,
		enabled: storageQuery !== "" || isTrending,
	})

	const {
		data: movieDetails,
		isLoading: isLoadingMovieID,
		isError: isModalError,
	} = useQuery({
		queryKey: ["searchById", movie_id, language],
		queryFn: async () => fetchMovieIdData(),
		enabled: movie_id > 0,
	})

	const createQueryParams = (query: string = storageQuery, page: number = currentPage): SearchParams => {
		const qParams: SearchParams = {
			query,
			include_adult: true,
			page,
			language,
		}
		return qParams
	}

	const fetchQueryData = async (query: string) => {
		const url: string = isTrending ? TRANDING_URL : SEARCH_URL
		const qParams: SearchParams = createQueryParams(query)
		const res = await getMovies(url, qParams)
		if (!res.results.length) {
			toastMessage(MyToastType.error, translationTexts.toast_bad_request)
		}
		//setPrevStorageQuery(storageQuery)
		return res
	}

	const fetchMovieIdData = async () => {
		const qParams: SearchParams = {
			movie_id,
			language,
		}
		return await getMovieById(qParams)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const handleSearch = async (query: string) => {
		setisTrending(false)
		setCurrentPage(1)
		setStorageQuery(query)
	}

	const handleClick = async (movie_id: number) => {
		setIsModalOpen(true)
		setMovieId(movie_id)
	}

	const handleSelectTrend = (): void => {
		setisTrending(true)
		setCurrentPage(1)
	}

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
		setScrollUp(false)
	}

	//console.log(movies)
	const total_pages: number = data?.total_pages || 0

	//	(storageQuery && data?.results?.length && data?.results) ||
	//	(!storageQuery && trendingMovies?.results.length && trendingMovies?.results) ||
	//	undefined

	//const varIsSucess = isSuccess || isTrendingSuccess
	const varIsLoading = isLoading || isLoadingMovieID
	const varIsError = isError || isModalError

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > SCROLL_THRESHOLD) {
				setScrollUp(true)
			} else {
				setScrollUp(false)
			}
		}

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	useEffect(() => {
		/// Mobile Back закриває модалку а не виходить із браузера
		if (isModalOpen) {
			// Додаємо новий запис у історію
			window.history.pushState({ modal: true }, "")

			const handlePopState = () => {
				// Коли користувач тисне "назад"
				setIsModalOpen(false)
				setMovieId(0)
			}
			// Слухаємо назад
			window.addEventListener("popstate", handlePopState)
			// Очищення при закритті модалки
			return () => {
				window.removeEventListener("popstate", handlePopState)
				// Повертаємося назад в історії, щоб не накопичувати зайвого
				if (window.history.state?.modal) {
					window.history.back()
				}
			}
		}
	}, [isModalOpen])

	//console.log(isLoading)
	return (
		<>
			<Toaster />
			<SearchBar selectTrend={handleSelectTrend} onSubmit={handleSearch} />
			{total_pages > 1 && (
				<ReactPaginate
					breakLabel="..."
					nextLabel=">"
					previousLabel="<"
					onPageChange={({ selected }) => {
						setCurrentPage(selected + 1)
					}}
					pageRangeDisplayed={3}
					marginPagesDisplayed={2}
					pageCount={total_pages}
					forcePage={currentPage - 1}
					containerClassName={css.pagination}
					activeClassName={css.active}
				/>
			)}
			{varIsLoading && <Loader />}
			{varIsError && <ErrorMessage />}
			{data && data?.results?.length > 0 && <MovieGrid movies={data.results} onSelect={handleClick} />}
			{isModalOpen && movieDetails && <MovieModal onClose={closeModal} movie={movieDetails} />}
			{isScrollUp && <ScrollUp onClick={scrollToTop} />}
		</>
	)
}

export default App
