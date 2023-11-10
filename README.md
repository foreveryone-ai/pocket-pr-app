# Button Component Documentation

The `Button` component is a reusable button component that can be used throughout the application. It is styled with Tailwind CSS and can optionally display an icon.

## Props

The `Button` component accepts the following props:

- `onClick`: A function that is called when the button is clicked. This function should not return anything (`void`).

- `children`: The content to be displayed inside the button. This can be a string of text, but it can also be any valid `ReactNode`, including other React components.

- `icon`: An optional icon to be displayed inside the button. This should be a component from the `react-icons` library. If this prop is not provided, no icon will be displayed.

## Usage

Here is an example of how to use the `Button` component:

```
import Button from "@/app/components/shared/Button";
import { FiHome } from "react-icons/fi";
import { useRouter } from "next/router";

const Component = () => {
const router = useRouter();

return (
  <Button
    icon={FiHome}
    onClick={() => router.push("/")}
  >
    Home
  </Button>
  );
};
```

In this example, the `Button` component is used to create a button that navigates to the home page when clicked. The button displays the `FiHome` icon and the text "Home". The `useRouter` hook from Next.js is used to handle the navigation.

## Styling

The `Button` component is styled with Tailwind CSS. It has a rounded border, a violet border and text color, and a hover effect that scales the button and changes the text color. It also has a transition effect that animates the hover and active states.

The `Button` component also uses the `before` pseudo-element to create a background effect. This effect is animated on hover.

## Accessibility

The `Button` component uses a `button` HTML element, which is accessible by default. The `onClick` prop corresponds to the `onclick` event handler of the `button` element, which is triggered when the user clicks the button or presses the "Enter" or "Space" key when the button is focused.
