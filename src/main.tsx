import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./components/App/App.tsx"
import { LanguageProvider } from "./components/LanguageContext/LanguageContext.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<LanguageProvider>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</LanguageProvider>
		</QueryClientProvider>
	</StrictMode>
)
