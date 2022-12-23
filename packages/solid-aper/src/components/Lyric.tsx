import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js"
import { Audio } from ".."
import lrcParser from "lrc-parser-ts"
import clsx from "clsx"

type Sentence = {
  start: number
  text: string
  end: number
}

type Lyrics = {
  ar: string
  ti: string
  al: string
  length: string
  scripts: Array<Sentence>
}

export type LyricProps = Pick<Audio, "lrc" | "lyric"> & {
  seek: number
  err?: string
}

export const Lyric = (props: LyricProps) => {
  const [lyrics, setLyrics] = createSignal<Lyrics>()
  const init = async () => {
    setLyrics(undefined)
    let lyric = props.lyric
    if (lyric) {
      return
    }
    if (!props.lrc) {
      return
    } else {
      const res = await fetch(props.lrc)
      const text = await res.text()
      lyric = text
    }
    setLyrics(lrcParser(lyric) as Lyrics)
  }
  createEffect(() => {
    init()
  })
  const scrollActive = () => {
    const active = document.querySelector(".aper .list-lyric .lyric .active")
    if (active) {
      active.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }
  const activeIndex = createMemo(() => {
    if (!lyrics()) {
      return -1
    }
    const index = lyrics()!.scripts.findIndex((item) => {
      return item.start <= props.seek && item.end >= props.seek
    })
    return index
  })
  createEffect(() => {
    activeIndex()
    scrollActive()
  })
  return (
    <Switch fallback={<div class="err">No lyric yet.</div>}>
      <Match when={props.err}>
        <div class="err">{props.err}</div>
      </Match>
      <Match when={lyrics()}>
        <For each={lyrics()!.scripts}>
          {(item, i) => (
            <div
              class={clsx("item", {
                active: activeIndex() === i(),
              })}
            >
              {item.text}
            </div>
          )}
        </For>
      </Match>
    </Switch>
  )
}
