<script>
  import progressiveImage from '~/components/bits/progressive-image.vue'

  export default {
    'name':  'nuxt-loading',
    'props': {
      'test': Boolean,
    },
    'components': {
      progressiveImage,
    },
    data () {
      return {
        'slow':      false,
        'loading':   false,
        'failed':    false,
        'slowTimer': null,
        'tickTimer': null,
      }
    },
    'methods': {
      reset () {
        clearTimeout(this.slowTimer)
        clearTimeout(this.tickTimer)

        this.slow = false
        this.loading = false
        this.failed = false
      },
      start () {
        this.reset()
        this.loading = true

        const patience = 1500

        this.slowTimer = setTimeout(() => {
          if (this.loading) {
            this.slow = true
          }
        }, patience)
      },
      finish () {
        this.reset()
      },
      fail () {
        this.reset()
        this.failed = true
      },
      increase (num) {
        this.percent = this.percent + Math.floor(num)
        return this
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/component';

  $size: 400px;
  $v-gap: 50vh;
  $h-gap: 50vw;

  $leftborder: calc(#{$h-gap} - calc(#{$size} / 2));
  $rightborder: calc(#{$h-gap} + calc(#{$size} / 2));
  $topborder: calc(#{$v-gap} - calc(#{$size} / 2));
  $bottomborder: calc(#{$v-gap} + calc(#{$size} / 2));

  $topleft: $leftborder $topborder;
  $topright: $rightborder $topborder;
  $bottomleft: $leftborder $bottomborder;
  $bottomright: $rightborder $bottomborder;

  @keyframes Gradient {
  	0% {
  		background-position: 100% 50%
  	}
  	100% {
  		background-position: 0 50%
  	}
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .active-spin {
    transition: transform .3s ease-in-out;

    &:active {
      animation: spin .5s;
    }
  }

  .fill {
    height: 100%;
    width: 100%;
    left: 0;
  }

  .ouc-quick-loading {
    background: repeating-linear-gradient(
      45deg,
      nth(map-get($colors, 'secondary'), 1),
      nth(map-get($colors, 'secondary'), 1) 10px,
      darken(nth(map-get($colors, 'secondary'), 1), 10) 10px,
      darken(nth(map-get($colors, 'secondary'), 1), 10) 20px
    );
    background-size: 400%;
    animation-name: Gradient;
    animation-duration: 45s;
    animation-timing-function: linear;
    animation-play-state: running;
    animation-iteration-count: infinite;
    position: fixed;
    left: 0;
    width: 100%;
    transition-property: height, top;
    transition-timing-function: map-get($animations, 'animation-function');
    transition-duration: map-get($animations, 'shorttime');
    top: map-get($kerning, 'navbar-height');
    height: 0;
    display: flex;
    z-index: 101;
    pointer-events: none;
    justify-content: center;

    &.show {
      height: .5rem;
    }

    &.large {
      top: 0;
      height: map-get($kerning, 'navbar-height');
      pointer-events: all;
    }
  }

  .is-fullwidth {
    width: 100%;
  }

  .is-inline {
    display: inline-flex;

    > * {
      display: inline-flex;
    }
  }

  .mh-1 {
    min-height: 3rem
  }
</style>

<template lang="pug">
  div
    button.button.is-primary(v-if="test", @click="finish") Finish
    .ouc-quick-loading(:class="{'show': loading, 'large': slow}")
</template>
