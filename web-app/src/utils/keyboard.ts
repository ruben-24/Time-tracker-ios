// Keyboard management utilities
export class KeyboardManager {
  private static instance: KeyboardManager
  private isKeyboardOpen = false
  private initialViewportHeight = 0

  static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager()
    }
    return KeyboardManager.instance
  }

  init() {
    if (typeof window === 'undefined') return

    this.initialViewportHeight = window.innerHeight
    
    // Detect keyboard open/close on mobile
    window.addEventListener('resize', this.handleResize.bind(this))
    
    // Prevent keyboard from disappearing on input focus
    document.addEventListener('focusin', this.handleFocusIn.bind(this))
    document.addEventListener('focusout', this.handleFocusOut.bind(this))
    
    // Prevent scroll when keyboard is open
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    
    // Additional touch events to prevent keyboard dismissal
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
  }

  private handleResize() {
    const currentHeight = window.innerHeight
    const heightDifference = this.initialViewportHeight - currentHeight
    
    // If height decreased significantly, keyboard is likely open
    if (heightDifference > 150) {
      this.isKeyboardOpen = true
      document.body.classList.add('keyboard-open')
    } else {
      this.isKeyboardOpen = false
      document.body.classList.remove('keyboard-open')
    }
  }

  private handleFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      // Mark keyboard as open
      this.isKeyboardOpen = true
      document.body.classList.add('keyboard-open')
      
      // Prevent keyboard from disappearing
      target.addEventListener('blur', this.preventKeyboardClose.bind(this), { once: true })
      
      // Scroll input into view with delay
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
      
      // Force focus to stay on input
      setTimeout(() => {
        if (document.activeElement !== target) {
          target.focus()
        }
      }, 100)
    }
  }

  private handleFocusOut(event: FocusEvent) {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      // Small delay to prevent keyboard from closing immediately
      setTimeout(() => {
        if (document.activeElement !== target) {
          this.isKeyboardOpen = false
          document.body.classList.remove('keyboard-open')
        }
      }, 100)
    }
  }

  private handleTouchMove(event: TouchEvent) {
    if (this.isKeyboardOpen) {
      // Prevent scrolling when keyboard is open
      const target = event.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return // Allow scrolling within input
      }
      event.preventDefault()
    }
  }

  private handleTouchStart(event: TouchEvent) {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      // Prevent keyboard from closing on touch
      event.preventDefault()
      target.focus()
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      // Keep focus on input
      setTimeout(() => {
        if (document.activeElement !== target) {
          target.focus()
        }
      }, 10)
    }
  }

  private preventKeyboardClose(event: Event) {
    // Prevent keyboard from closing on blur
    event.preventDefault()
    event.stopPropagation()
    
    // Force focus back to input
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      setTimeout(() => {
        target.focus()
      }, 50)
    }
  }

  isKeyboardVisible(): boolean {
    return this.isKeyboardOpen
  }

  destroy() {
    if (typeof window === 'undefined') return
    
    window.removeEventListener('resize', this.handleResize.bind(this))
    document.removeEventListener('focusin', this.handleFocusIn.bind(this))
    document.removeEventListener('focusout', this.handleFocusOut.bind(this))
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    document.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }
}

// Initialize keyboard manager
export const keyboardManager = KeyboardManager.getInstance()