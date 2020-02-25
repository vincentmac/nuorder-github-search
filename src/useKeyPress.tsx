import { useState, useEffect } from "react";

export const useKeyPress = function(targetKey: any) {
	const [keyPressed, setKeyPressed] = useState(false);

	function downHandler(this: Window, evt: Event) {
		if (evt === targetKey) {
			setKeyPressed(true);
		}
		return true;
	}

	function upHandler(this: Window, evt: Event) {
		if (evt === targetKey) {
			setKeyPressed(false);
		}
		return true;
	};

	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	});
	return keyPressed;
};

export default useKeyPress;
