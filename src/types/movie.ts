export interface Movie {
	adult?: boolean // за замовчуванням true
	backdrop_path: string
	genre_ids?: number[]
	id: number // за замовчуванням 0
	original_language?: string
	original_title?: string
	overview: string
	popularity?: number // за замовчуванням 0
	poster_path: string
	release_date: string
	title: string
	video?: boolean // за замовчуванням true
	vote_average: number // за замовчуванням 0
	vote_count: number // за замовчуванням 0
	belongs_to_collection?: object | null
	budget?: number
	genres?: { id: number; name: string }[]
	homepage?: string
	imdb_id?: string
	production_companies?: {
		id: number
		logo_path: string | null
		name: string
		origin_country: string
	}[]
	production_countries?: {
		iso_3166_1: string
		name: string
	}[]
	revenue?: number
	runtime?: number
	spoken_languages?: {
		iso_639_1: string
		name: string
	}[]
	status?: string
	tagline?: string
	media_type?: string
}
