import {
  animate,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations' // https://m3.material.io/styles/motion

// 👇 Keep in sync with SCSS
// https://m3.material.io/styles/motion
export const STANDARD_DURATION = '.3s'
export const EMPHASIZED_DURATION = '.5s'
const TIMING_FUNCTION = 'cubic-bezier(0.2, 0, 0, 1.0)'

type Timings = Exclude<Parameters<typeof animate>[0], undefined>

function getTimings(duration: string): Timings {
  return `${duration} ${TIMING_FUNCTION}`
}

const EMPHASIZED_TIMINGS = getTimings(EMPHASIZED_DURATION)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STANDARD_TIMINGS = getTimings(STANDARD_DURATION)

class EnterLeaveFadeInOutAnimations {
  readonly minOpacity = style({ opacity: '0' })
  readonly maxOpacity = style({ opacity: '1' })
  readonly timings = EMPHASIZED_TIMINGS
  readonly animateToMin = animate(this.timings, this.minOpacity)
  readonly animateToMax = animate(this.timings, this.maxOpacity)

  /**
   * Creates a fade in / fade out animation when children elements enter and leave
   *
   * @see https://angular.io/guide/route-animations
   * @see https://www.youtube.com/watch?v=7JA90VI9fAI
   *
   * @param triggerName
   */
  public children(triggerName: string): AnimationTriggerMetadata {
    return trigger(triggerName, [
      transition(DEFAULT_TRANSITION, [
        style({ position: 'relative' }),
        optionalQuery(
          `${ENTER_SELECTOR},${LEAVE_SELECTOR}`,
          // 👇 Needed so both children are positioned in same place, one above the other
          [style({ position: 'absolute', top: '0', left: '0', width: '100%' })],
        ),
        optionalQuery(ENTER_SELECTOR, this.minOpacity),
        optionalQuery(LEAVE_SELECTOR, this.maxOpacity),
        group([
          optionalQuery(LEAVE_SELECTOR, this.animateToMin),
          optionalQuery(ENTER_SELECTOR, this.animateToMax),
        ]),
      ]),
    ])
  }

  /**
   * Creates a fade in / fade out animation when the element enters and leaves
   * @param triggerName
   */
  public element(triggerName: string) {
    return trigger(triggerName, [
      transition(ENTER_TRANSITION, [this.minOpacity, this.animateToMax]),
      transition(LEAVE_TRANSITION, [this.maxOpacity, this.animateToMin]),
    ])
  }
}

function optionalQuery(
  selector: Parameters<typeof query>[0],
  animations: Parameters<typeof query>[1],
  options?: Parameters<typeof query>[2],
) {
  return query(selector, animations, { ...options, optional: true })
}

export const ENTER_LEAVE_FADE_IN_OUT_ANIMATIONS =
  new EnterLeaveFadeInOutAnimations()

const ENTER_SELECTOR = ':enter'
const ENTER_TRANSITION = ENTER_SELECTOR
const LEAVE_SELECTOR = ':leave'
const LEAVE_TRANSITION = LEAVE_SELECTOR
const DEFAULT_TRANSITION = '* <=> *'
