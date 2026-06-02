import React, { useEffect } from 'react'

export default function AdsInjector() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // avoid injecting twice
    if (document.getElementById('adsbygoogle-js')) return

    const s = document.createElement('script')
    s.async = true
    s.id = 'adsbygoogle-js'
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4383894905085614'
    s.crossOrigin = 'anonymous'

    s.onload = () => {
      // eslint-disable-next-line no-console
      console.log('AdsInjector: adsbygoogle script loaded')
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        w.adsbygoogle = w.adsbygoogle || []
        // Request Auto ads (page-level). AdSense may require site approval and can take time to show ads.
        w.adsbygoogle.push({
          google_ad_client: 'ca-pub-4383894905085614',
          enable_page_level_ads: true,
        })
        // eslint-disable-next-line no-console
        console.log('AdsInjector: adsbygoogle initialized', !!w.adsbygoogle)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('AdsInjector: error initializing adsbygoogle', e)
      }
    }

    s.onerror = (err) => {
      // eslint-disable-next-line no-console
      console.error('AdsInjector: failed to load adsbygoogle script', err)
    }

    // eslint-disable-next-line no-console
    console.log('AdsInjector: appending adsbygoogle script')
    document.head.appendChild(s)

    return () => {
      // keep the script (removing can break other pages), but if you want to remove:
      // const el = document.getElementById('adsbygoogle-js'); el?.remove();
    }
  }, [])

  return (
    <div aria-hidden className="ads-injector">
      {/* Insert ad unit markup where you want ads to appear. Example:
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-4383894905085614"
               data-ad-slot="YOUR_AD_SLOT"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        */}
    </div>
  )
}
