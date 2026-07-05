'use client'

import { useEffect, useState, useRef } from 'react'

export function useReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible] as const
}

export function useLandingPage() {
  const [featuresRef, featuresVisible] = useReveal()
  const [rolesRef, rolesVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursorRing')
    let mx = 0, my = 0, rx = 0, ry = 0
    let reqId: number

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (cursor) {
        cursor.style.left = mx + 'px'
        cursor.style.top = my + 'px'
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    function animateRing() {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ring) {
        ring.style.left = rx + 'px'
        ring.style.top = ry + 'px'
      }
      reqId = requestAnimationFrame(animateRing)
    }
    animateRing()

    const interactiveEls = document.querySelectorAll('button, a, .feature-card, .role-card')
    const handleMouseEnter = () => {
      if (cursor) {
        cursor.style.width = '18px'
        cursor.style.height = '18px'
      }
      if (ring) {
        ring.style.width = '52px'
        ring.style.height = '52px'
      }
    }
    const handleMouseLeave = () => {
      if (cursor) {
        cursor.style.width = '10px'
        cursor.style.height = '10px'
      }
      if (ring) {
        ring.style.width = '36px'
        ring.style.height = '36px'
      }
    }

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    const handleScroll = () => {
      const nav = document.getElementById('nav')
      if (nav) {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(reqId)
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return {
    featuresRef,
    featuresVisible,
    rolesRef,
    rolesVisible,
    ctaRef,
    ctaVisible
  }
}
