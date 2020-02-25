import {useState, useEffect} from "react";

export default function useDebounce(value: any, delay: number) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(
		() => {
			
			// Update debouncedValue after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			// Cancel the timeout if the value changes. This will prevent
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay]
	);

	return debouncedValue;
}
