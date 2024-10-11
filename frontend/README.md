# Frontend

This will handle the electron renderer process.

This directory follows the generic structure of a NextJS app (using the App router).

Make sure to add proper typings for the APIs exposed over the context bridge in `context.d.ts`.

The template comes with [SVGR](https://react-svgr.com/) installed and pre-configured, so you can import SVG files as React components.

> [!TIP]  
> You can use the `<Image />` component along with static file imports for images like this example.

```tsx
import Menhera from '@/assets/path/to/menhera.png'

export function MenheraComponent() {
	return <Image src={Menhera.src} height={200} width={200} alt="menhera" />
}
```
