import clsx from "clsx"
import { For } from "solid-js"
import { Audio } from ".."

export interface ListProps {
  audios: Audio[]
  playIndex: number
  onPlayIndexChange?: (index: number) => void
}
export const List = (props: ListProps) => {
  return (
    <>
      <For each={props.audios}>
        {(audio, index) => (
          <div
            class={clsx("item", {
              playing: index() === props.playIndex,
            })}
            onClick={() => {
              props.playIndex !== index() && props.onPlayIndexChange?.(index())
            }}
          >
            <ListItem {...audio} />
          </div>
        )}
      </For>
    </>
  )
}

export const ListItem = (props: Audio) => {
  return (
    <>
      <div class="name" title={props.name}>
        {props.name}
      </div>
      <div class="artist" title={props.artist}>
        {props.artist}
      </div>
    </>
  )
}
