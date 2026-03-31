import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";
import { PrivacyNav } from "@/components/privacy/PrivacyNav";
import { PrivacyPolicySection, Bullet, Callout } from "@/components/privacy/PrivacySection";
import {
  Globe, Database, Settings, Eye, Cookie, ExternalLink,
  Megaphone, Clock, ShieldCheck, Baby, Scale, Plane,
  RefreshCw, Mail, Cpu
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy — Laptop Analyzer"
        description="Laptop Analyzer's privacy policy. Learn how we handle diagnostics, cookies, analytics, advertising, and your rights."
        canonicalPath="/privacy-policy"
      />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <PrivacyHero />
          <PrivacyNav />

          <div className="space-y-6">

            {/* 1 · Who We Are */}
            <PrivacyPolicySection id="who-we-are" icon={Globe} title="Who We Are">
              <p>
                Laptop Analyzer (<strong className="text-foreground">laptopanalyzer.com</strong>) is a free, browser-based diagnostic platform. It lets you test your laptop's display, keyboard, camera, microphone, speakers, network, touchpad, and ports — directly from your browser, with no downloads or accounts.
              </p>
            </PrivacyPolicySection>

            {/* 2 · Information We Collect */}
            <PrivacyPolicySection id="info-collect" icon={Database} title="Information We Collect" highlight>
              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Voluntarily provided</h3>
                <p>
                  No account is required. If you email us, we receive your name, email address, and message content — nothing more.
                </p>
              </div>

              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Automatically collected</h3>
                <p className="mb-3">
                  Like most websites, we (and our third-party service providers) may automatically collect limited technical data when you visit:
                </p>
                <ul className="space-y-2">
                  <Bullet>IP address (may be anonymised depending on configuration)</Bullet>
                  <Bullet>Browser type, version, and language</Bullet>
                  <Bullet>Operating system and device category</Bullet>
                  <Bullet>Pages viewed, session duration, and referral URL</Bullet>
                  <Bullet>Screen resolution and viewport size</Bullet>
                </ul>
              </div>

              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Diagnostic data</h3>
                <p>
                  Test results — pixel checks, audio levels, keystroke responses — are <strong className="text-foreground">processed entirely on your device</strong>. They are not sent to our servers or any third party.
                </p>
              </div>
            </PrivacyPolicySection>

            {/* 3 · How We Use Information */}
            <PrivacyPolicySection id="how-we-use" icon={Settings} title="How We Use This Information">
              <ul className="space-y-2">
                <Bullet title="Service delivery">Operating, maintaining, and improving the diagnostic tools and website</Bullet>
                <Bullet title="Analytics">Understanding traffic patterns and feature usage to guide improvements</Bullet>
                <Bullet title="Security">Detecting and preventing abuse, spam, and unauthorized access</Bullet>
                <Bullet title="Advertising">Serving ads via Google AdSense to keep the platform free</Bullet>
                <Bullet title="Preferences">Storing your theme choice (light / dark) in local browser storage</Bullet>
              </ul>
              <p className="text-sm">
                We do not sell, rent, or trade personal information to third parties for marketing.
              </p>
            </PrivacyPolicySection>

            {/* 4 · Local Processing Callout */}
            <PrivacyPolicySection id="local-processing" icon={Cpu} title="Local Processing — How Tests Work">
              <Callout variant="local">
                <strong className="text-foreground">How it works:</strong> When you run a diagnostic test, the test executes inside your browser using standard web APIs (MediaDevices, Canvas, Web Audio, WebHID, etc.). Raw hardware signals — video frames, audio samples, key events — are analysed on your device in real time. No test data is uploaded, logged, or transmitted anywhere.
              </Callout>
              <p>
                This architecture means your diagnostic results exist only in your current browser session. If you close or refresh the page, they are gone.
              </p>
            </PrivacyPolicySection>

            {/* 5 · Browser Permissions */}
            <PrivacyPolicySection id="browser-permissions" icon={Eye} title="Browser Permissions">
              <p>
                Some tests need hardware access via your browser's permission prompt. Permissions are requested only when you start the relevant test:
              </p>
              <ul className="space-y-2">
                <Bullet title="Camera">Used for the webcam test. The video stream renders locally and is never recorded or transmitted</Bullet>
                <Bullet title="Microphone">Used for the mic test. Audio is analysed in real time on-device — never recorded</Bullet>
                <Bullet title="Device access">Port tests may request USB or Bluetooth enumeration via browser APIs. This data stays local</Bullet>
              </ul>
              <p className="text-sm">
                You can deny or revoke any permission in your browser settings at any time. Denying a permission only limits that specific test — everything else works normally.
              </p>
            </PrivacyPolicySection>

            {/* 6 · Cookies & Tracking */}
            <PrivacyPolicySection id="cookies" icon={Cookie} title="Cookies and Tracking Technologies" highlight>
              <p>
                We use cookies — small text files stored by your browser — along with similar technologies. Here is what's active on this site:
              </p>

              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-3 text-foreground font-semibold">Category</th>
                      <th className="text-left p-3 text-foreground font-semibold">What it does</th>
                      <th className="text-left p-3 text-foreground font-semibold hidden sm:table-cell">Set by</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium text-foreground">Essential</td>
                      <td className="p-3">Theme preference, cookie-consent state, basic functionality</td>
                      <td className="p-3 hidden sm:table-cell">First-party</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Analytics</td>
                      <td className="p-3">Pageviews, session duration, feature usage, performance metrics</td>
                      <td className="p-3 hidden sm:table-cell">Google Analytics</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Advertising</td>
                      <td className="p-3">Ad personalisation, frequency capping, conversion measurement</td>
                      <td className="p-3 hidden sm:table-cell">Google AdSense</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Security</td>
                      <td className="p-3">Bot mitigation, DDoS protection, CDN routing</td>
                      <td className="p-3 hidden sm:table-cell">Cloudflare</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                You can manage preferences via the cookie consent banner shown on your first visit, or adjust your browser's cookie settings directly. Blocking certain cookies may limit some website features.
              </p>
            </PrivacyPolicySection>

            {/* 7 · Third-Party Services */}
            <PrivacyPolicySection id="third-party" icon={ExternalLink} title="Third-Party Services">
              <p>
                We rely on the following providers, each operating under their own privacy policies:
              </p>
              <ul className="space-y-3">
                <Bullet title="Google Analytics">
                  Collects anonymised usage data (pages visited, session length, device type) to help us understand traffic.{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Policy →</a>
                </Bullet>
                <Bullet title="Google AdSense">
                  Serves ads and may use cookies based on your browsing activity across sites.{" "}
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">How Google uses data →</a>
                </Bullet>
                <Bullet title="Cloudflare">
                  Provides CDN, performance, and security services. May process IP addresses and browser metadata.{" "}
                  <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Policy →</a>
                </Bullet>
                <Bullet title="Google Fonts">
                  Fonts may load from Google servers, transmitting your IP address in the request.{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Policy →</a>
                </Bullet>
              </ul>
              <p className="text-sm">
                We do not control how these providers handle data once it reaches their systems. We encourage you to review their policies directly.
              </p>
            </PrivacyPolicySection>

            {/* 8 · Advertising & AdSense */}
            <PrivacyPolicySection id="advertising" icon={Megaphone} title="Advertising Disclosure">
              <Callout variant="info">
                Laptop Analyzer is free to use. Advertising revenue through Google AdSense helps fund ongoing development and hosting costs.
              </Callout>
              <p>
                Google and its certified ad partners use cookies to serve ads based on your prior visits to this and other websites. These cookies enable ad personalisation, frequency capping, and aggregated ad reporting.
              </p>
              <p>
                You can opt out of personalised advertising through{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>{" "}
                or the{" "}
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DAA opt-out page</a>.
                {" "}You will still see ads after opting out — they simply won't be personalised.
              </p>
            </PrivacyPolicySection>

            {/* 9 · Data Retention */}
            <PrivacyPolicySection id="data-retention" icon={Clock} title="Data Retention">
              <p>
                Diagnostic results are not stored — they exist only in your browser session. Analytics and security logs held by third-party providers (Google, Cloudflare) follow their respective retention schedules. Email correspondence is kept only as long as needed to resolve your inquiry, unless you ask us to delete it sooner.
              </p>
            </PrivacyPolicySection>

            {/* 10 · Data Security */}
            <PrivacyPolicySection id="security" icon={ShieldCheck} title="Data Security">
              <p>
                We apply industry-standard safeguards to protect information processed through our site:
              </p>
              <ul className="space-y-2">
                <Bullet title="Encryption">All traffic is served over HTTPS / TLS</Bullet>
                <Bullet title="Edge protection">Cloudflare provides DDoS mitigation, WAF, and bot management</Bullet>
                <Bullet title="Minimal surface">Because most diagnostics run locally, there is very little server-side data to protect in the first place</Bullet>
              </ul>
              <p className="text-sm">
                No system is 100% secure. We take reasonable precautions, but cannot guarantee absolute security of any data transmitted over the internet.
              </p>
            </PrivacyPolicySection>

            {/* 11 · Children's Privacy */}
            <PrivacyPolicySection id="children" icon={Baby} title="Children's Privacy">
              <p>
                Laptop Analyzer is not directed at children under 13 (or the applicable age of digital consent in your region). We do not knowingly collect personal information from minors. If you believe a child has submitted personal data, please contact us and we will delete it promptly.
              </p>
            </PrivacyPolicySection>

            {/* 12 · Your Rights */}
            <PrivacyPolicySection id="your-rights" icon={Scale} title="Your Rights and Choices">
              <ul className="space-y-2">
                <Bullet title="Browser controls">Adjust cookie, permission, and privacy settings in your browser at any time</Bullet>
                <Bullet title="Cookie consent">Withdraw or change preferences via the consent banner on our site</Bullet>
                <Bullet title="Ad opt-out">Disable personalised ads through Google Ads Settings or the DAA opt-out page</Bullet>
                <Bullet title="Permission revocation">Revoke camera, microphone, or device access in your browser's site settings</Bullet>
                <Bullet title="Data requests">Contact us for access, correction, or deletion requests</Bullet>
              </ul>
              <p className="text-sm">
                Users in the EEA, UK, or jurisdictions with applicable data-protection laws may have additional rights including access, rectification, erasure, and objection. Contact us to exercise them.
              </p>
            </PrivacyPolicySection>

            {/* 13 · International Users */}
            <PrivacyPolicySection id="international" icon={Plane} title="International Users">
              <p>
                Laptop Analyzer is accessible worldwide. Data collected by third-party services may be processed in countries other than your own. By using this site, you acknowledge that data may cross borders and be subject to different privacy laws.
              </p>
            </PrivacyPolicySection>

            {/* 14 · Changes */}
            <PrivacyPolicySection id="changes" icon={RefreshCw} title="Updates to This Policy">
              <p>
                We may revise this policy to reflect changes in our practices or applicable law. The "Last updated" date at the top will always reflect the latest version. Continued use of Laptop Analyzer after changes constitutes acceptance of the updated policy.
              </p>
            </PrivacyPolicySection>

            {/* 15 · Contact */}
            <PrivacyPolicySection id="contact" icon={Mail} title="Contact Us" highlight>
              <p>
                Questions about this policy or your privacy? Reach out:
              </p>
              <div className="rounded-xl bg-muted/30 border border-border p-5">
                <p className="text-foreground font-semibold mb-1">Laptop Analyzer — Privacy</p>
                <a href="mailto:support@laptopanalyzer.com" className="text-primary hover:underline font-medium">
                  support@laptopanalyzer.com
                </a>
                <p className="text-sm mt-3">
                  We aim to respond within 5 business days.
                </p>
              </div>
            </PrivacyPolicySection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
