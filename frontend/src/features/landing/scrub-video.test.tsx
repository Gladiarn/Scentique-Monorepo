import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrubVideo } from "./scrub-video";
import { videoTimeAt } from "@/lib/scrub";

const props = { src: "/media/hero.mp4", srcMobile: "/media/hero-m.mp4", poster: "/media/hero-poster.webp", posterMobile: "/media/hero-m-poster.webp", label: "Perfume bottle in warm light" };

function media(wide: boolean, reduced = false) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (q: string) => ({ matches: q.includes("reduce") ? reduced : q.includes("min-width") ? wide : false, addEventListener() {}, removeEventListener() {} }),
  });
}

const renderIn = (ui = <ScrubVideo {...props} />) => render(<section data-scrub-section="">{ui}</section>);

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0; // synchronous in tests, so the id must stay falsy or the next scroll is ignored
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ScrubVideo", () => {
  it("shows the poster first, a still of the clip's first frame for each screen size, with an accessible label", () => {
    media(true);
    const { container } = renderIn();
    const picture = container.querySelector("picture")!;
    expect(picture.querySelector("source")).toHaveAttribute("srcset", props.poster);
    expect(picture.querySelector("source")).toHaveAttribute("media", "(min-width: 768px)");
    expect(picture.querySelector("img")).toHaveAttribute("src", props.posterMobile);
    expect(container.querySelector("[role=img]")).toHaveAttribute("aria-label", props.label);
  });

  it("plays the wide clip on large screens, muted and inline, and never loops audio", () => {
    media(true);
    const { container } = renderIn();
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("src", props.src);
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("autoplay");
  });

  it("uses the portrait clip on phones", () => {
    media(false);
    const { container } = renderIn();
    expect(container.querySelector("video")).toHaveAttribute("src", props.srcMobile);
  });

  it("stays a still image under reduced motion: no video at all", () => {
    media(true, true);
    const { container } = renderIn();
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("picture")).toBeInTheDocument();
  });

  it("scrubs: the playhead follows how far the section has scrolled", () => {
    media(true);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: -800, height: 2600 } as DOMRect);
    const { container } = renderIn();
    const video = container.querySelector("video") as HTMLVideoElement;
    Object.defineProperty(video, "duration", { configurable: true, value: 8 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    // jsdom viewport is 768 tall: progress = 800 / (2600 - 768)
    expect(video.currentTime).toBeCloseTo(videoTimeAt(800 / (2600 - window.innerHeight), 8), 3);
  });
});
