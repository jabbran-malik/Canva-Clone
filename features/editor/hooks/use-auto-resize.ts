import * as fabric from 'fabric'
import { useCallback, useEffect } from 'react';

type WorkspaceObject = fabric.FabricObject & { name?: string };

interface useAutoResizProps {
    canvas: fabric.Canvas | null;
    container: HTMLDivElement | null;
}

export const useAutoResize = ({
    canvas,
    container,

}: useAutoResizProps) => {
    const autoZoom = useCallback(async () => {
        if (!canvas || !container) return;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        canvas.setDimensions({
            width,
            height,
        });
        const center = canvas.getVpCenter();
        const zoomRatio = 0.85;
        const localWorkSpace = canvas
            .getObjects()
            .find((object) =>
                (object as WorkspaceObject).name === "clip"
            )

        if (!localWorkSpace) return;

        const scale = fabric.util.findScaleToFit(localWorkSpace, {
            width: width,
            height: height,
        });
        const zoom = zoomRatio * scale;
        canvas.setViewportTransform([...fabric.iMatrix]);
        canvas.zoomToPoint(
            new fabric.Point(center.x, center.y),
            zoom
        );

        const workspaceCenter = localWorkSpace.getCenterPoint()
        // Copy the matrix before editing it: `canvas` is a hook argument, so
        // writing through `canvas.viewportTransform` would mutate it in place.
        const nextTransform: fabric.TMat2D = [...canvas.viewportTransform];
        nextTransform[4] = canvas.width / 2 - workspaceCenter.x * nextTransform[0];
        nextTransform[5] = canvas.height / 2 - workspaceCenter.y * nextTransform[3];

        canvas.setViewportTransform(nextTransform)
        const cloned = await localWorkSpace.clone();

        canvas.set({ clipPath: cloned });
        canvas.requestRenderAll();

    }, [canvas, container])
    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;
        if (canvas && container) {
            resizeObserver = new ResizeObserver(() => {
                autoZoom();
            })
            resizeObserver.observe(container)
        }
        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
        }
    }, [canvas, container, autoZoom])
}
