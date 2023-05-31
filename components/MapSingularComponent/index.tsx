import dynamic from "next/dynamic";

const MapSingularComponent = dynamic(() => import('./MapSingularComponent'), {
    ssr: false
});

export default MapSingularComponent