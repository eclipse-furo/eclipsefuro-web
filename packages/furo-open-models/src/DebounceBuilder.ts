/**
 * @param {Function} func
 * @param {number} delay
 */
export default function DebounceBuilder(
  // eslint-disable-next-line @typescript-eslint/ban-types
  func: Function,
  delay: number = 10,
  option = { leading: false, trailing: true },
) {
  let timer: ReturnType<typeof setTimeout> | number | undefined; // same like basic debounce
  let trailingArgs: unknown[] = []; // as we require last arguments for trailing

  if (!option.leading && !option.trailing) return () => null; // if both false, return null

  return function debounced(...args: unknown[]) {
    // returns a debounced function

    if (!timer && option.leading) {
      // timer done but leading true
      func(args); // call func
    } else {
      trailingArgs = args; // arguments will be the last args
    }

    clearTimeout(timer); // clear timer for avoiding multiple timer instances

    timer = setTimeout(() => {
      if (option.trailing && trailingArgs) func(...trailingArgs); // trailingArgs is present and trailing is true

      trailingArgs = []; // reset last arguments
      timer = undefined; // reset timer
    }, delay);
  };
}
