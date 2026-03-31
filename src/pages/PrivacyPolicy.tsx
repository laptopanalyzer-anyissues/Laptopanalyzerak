import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";
import { PrivacyNav } from "@/components/privacy/PrivacyNav";
import { PrivacyPolicySection, Bullet, Callout } from "@/components/privacy/PrivacySection";
import {
  Globe, Database, Settings, Eye, Cookie, ExternalLink,
  Megaphone, Clock, ShieldCheck, Baby, Scale, Plane,
  RefreshCw, Mail
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy — Laptop Analyzer"
        description="Learn how Laptop Analyzer handles your data. Our privacy policy covers diagnostics, cookies, analytics, advertising, and your rights."
      />
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <PrivacyHero />
          <PrivacyNav />

          <div className="space-y-6">
            {/* 1. Who We Are */}
            <PrivacyPolicySection id="who-we-are" icon={Globe} title="Who We Are">
              <p>
                Laptop Analyzer (<strong className="text-foreground">laptopanalyzer.com</strong>) is a free, browser-based diagnostic platform that helps users evaluate the health and performance of their laptops. Our tools cover display quality, keyboard functionality, camera, microphone, speakers, network speed, touchpad responsiveness, and port connectivity.
              </p>
              <p>
                Our mission is to make hardware diagnostics accessible to everyone — no downloads, no installations, no account required. Most tests execute directly within your web browser using standard browser APIs.
              </p>
            </PrivacyPolicySection>

            {/* 2. Information We Collect */}
            <PrivacyPolicySection id="info-collect" icon={Database} title="Information We Collect" highlight>
              <Callout variant="trust">
                <strong className="text-success">Privacy-first approach:</strong> Laptop Analyzer does not require user accounts, and our diagnostic tests are designed to run locally in your browser. However, like most websites, certain technical data may be collected through standard web technologies and third-party services.
              </Callout>

              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Information You Provide Voluntarily</h3>
                <p>
                  We do not require you to create an account or submit personal information to use our diagnostic tools. If you contact us via email, we may receive your name, email address, and the content of your message.
                </p>
              </div>

              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Automatically Collected Technical Data</h3>
                <p className="mb-3">
                  When you visit our website, certain information may be collected automatically through cookies, log files, and third-party services. This may include:
                </p>
                <ul className="space-y-2">
                  <Bullet>IP address (may be anonymised depending on service configuration)</Bullet>
                  <Bullet>Browser type, version, and language preferences</Bullet>
                  <Bullet>Operating system and device type</Bullet>
                  <Bullet>Pages visited, time spent, and referral URLs</Bullet>
                  <Bullet>Screen resolution and viewport information</Bullet>
                </ul>
              </div>

              <div>
                <h3 className="text-foreground font-semibold mb-2 text-base">Diagnostic and Browser-Generated Data</h3>
                <p>
                  When you run a diagnostic test, the test executes within your browser using standard web APIs. Test results — such as pixel data from a display test, audio levels from a microphone test, or keystroke responses from a keyboard test — are <strong className="text-foreground">processed locally on your device</strong> and are not transmitted to our servers or any third party.
                </p>
              </div>
            </PrivacyPolicySection>

            {/* 3. How We Use Information */}
            <PrivacyPolicySection id="how-we-use" icon={Settings} title="How We Use Information">
              <p>Any information we receive is used for the following purposes:</p>
              <ul className="space-y-2">
                <Bullet title="Website operation">Delivering and maintaining the functionality of our diagnostic tools and website</Bullet>
                <Bullet title="Analytics and improvement">Understanding how visitors use our site so we can improve the user experience, identify issues, and prioritise new features</Bullet>
                <Bullet title="Security">Protecting against abuse, fraud, and unauthorised access through standard web security measures</Bullet>
                <Bullet title="Ad delivery">Serving relevant advertisements through Google AdSense to support the free availability of our tools</Bullet>
                <Bullet title="Preferences">Remembering your settings, such as theme preference (light or dark mode), using local browser storage</Bullet>
              </ul>
              <p className="text-sm">
                We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
              </p>
            </PrivacyPolicySection>

            {/* 4. Browser Permissions */}
            <PrivacyPolicySection id="browser-permissions" icon={Eye} title="Browser Permissions">
              <p>
                Certain diagnostic tests require access to hardware features through your browser's permission system. We only request permissions when you actively initiate a specific test:
              </p>
              <ul className="space-y-2">
                <Bullet title="Camera">Requested for the webcam/camera test. The video stream is rendered locally in your browser and is not recorded, stored, or transmitted</Bullet>
                <Bullet title="Microphone">Requested for the microphone test. Audio input is analysed locally in real time and is never recorded or sent to any server</Bullet>
                <Bullet title="Device access">Some tests may request access to connected peripherals (such as USB or Bluetooth) through browser APIs for port detection purposes. This data remains local to your device</Bullet>
              </ul>
              <Callout>
                You are always free to deny or revoke any permission through your browser settings. Denying a permission will not affect other tests — only the specific test requiring that permission will be limited.
              </Callout>
            </PrivacyPolicySection>

            {/* 5. Cookies and Tracking Technologies */}
            <PrivacyPolicySection id="cookies" icon={Cookie} title="Cookies and Tracking Technologies">
              <p>
                Our website uses cookies and similar technologies. A cookie is a small text file placed on your device by your browser. We use the following categories:
              </p>

              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-3 text-foreground font-semibold">Type</th>
                      <th className="text-left p-3 text-foreground font-semibold">Purpose</th>
                      <th className="text-left p-3 text-foreground font-semibold hidden sm:table-cell">Provider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium text-foreground">Essential</td>
                      <td className="p-3">Core functionality, theme preferences, cookie consent state</td>
                      <td className="p-3 hidden sm:table-cell">First-party</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Analytics</td>
                      <td className="p-3">Usage statistics, page views, performance monitoring</td>
                      <td className="p-3 hidden sm:table-cell">Google Analytics</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Advertising</td>
                      <td className="p-3">Ad personalisation, frequency capping, conversion tracking</td>
                      <td className="p-3 hidden sm:table-cell">Google AdSense</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Security</td>
                      <td className="p-3">Bot detection, DDoS protection, performance optimisation</td>
                      <td className="p-3 hidden sm:table-cell">Cloudflare</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                You can manage your cookie preferences through the consent banner displayed when you first visit our site. You may also configure your browser to block or delete cookies at any time, though this may affect certain website functionality.
              </p>
            </PrivacyPolicySection>

            {/* 6. Third-Party Services */}
            <PrivacyPolicySection id="third-party" icon={ExternalLink} title="Third-Party Services">
              <p>
                We integrate with the following third-party services, each of which operates under its own privacy policy. We encourage you to review their policies:
              </p>
              <ul className="space-y-3">
                <Bullet title="Google Analytics">
                  Helps us understand visitor behaviour and website performance. May collect device information, browser type, pages visited, and interaction data. {" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy →</a>
                </Bullet>
                <Bullet title="Google AdSense">
                  Serves advertisements on our website. Google and its advertising partners may use cookies to deliver ads based on your browsing history. {" "}
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">How Google uses data →</a>
                </Bullet>
                <Bullet title="Cloudflare">
                  Provides content delivery, performance optimisation, and security services. May process limited technical data such as IP address and browser type. {" "}
                  <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy →</a>
                </Bullet>
                <Bullet title="Google Fonts">
                  Web fonts may be loaded from Google's servers, which involves your browser making requests that transmit your IP address. {" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy →</a>
                </Bullet>
              </ul>
            </PrivacyPolicySection>

            {/* 7. Advertising and AdSense Disclosure */}
            <PrivacyPolicySection id="advertising" icon={Megaphone} title="Advertising and AdSense Disclosure">
              <p>
                Laptop Analyzer is a free service supported in part by advertising revenue. We display advertisements through the Google AdSense programme.
              </p>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your browsing patterns.
              </p>
              <p>
                You may opt out of personalised advertising at any time by visiting{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>{" "}
                or the{" "}
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Advertising Alliance opt-out page</a>. Even after opting out, you may still see non-personalised ads.
              </p>
            </PrivacyPolicySection>

            {/* 8. Data Retention */}
            <PrivacyPolicySection id="data-retention" icon={Clock} title="Data Retention">
              <p>
                Since our diagnostic tests run locally in your browser, we do not retain any test results or hardware-related data on our servers.
              </p>
              <p>
                Analytics and log data collected through third-party services (such as Google Analytics) are retained according to their respective default retention periods and policies. Security-related logs maintained by Cloudflare are typically retained for a limited period as necessary for security and operational purposes.
              </p>
              <p>
                If you contact us by email, we may retain your correspondence for as long as necessary to address your inquiry and for our records, unless you request its deletion.
              </p>
            </PrivacyPolicySection>

            {/* 9. Data Security */}
            <PrivacyPolicySection id="security" icon={ShieldCheck} title="Data Security">
              <p>
                We implement reasonable technical and organisational measures to protect information processed through our website, including the use of HTTPS encryption, Cloudflare security services, and secure hosting infrastructure.
              </p>
              <p>
                However, no method of transmission over the internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </PrivacyPolicySection>

            {/* 10. Children's Privacy */}
            <PrivacyPolicySection id="children" icon={Baby} title="Children's Privacy">
              <p>
                Laptop Analyzer is a general-purpose diagnostic tool not directed at children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children.
              </p>
              <p>
                If you are a parent or guardian and believe that a child has provided personal information through our website, please contact us at the address below and we will take steps to address the matter promptly.
              </p>
            </PrivacyPolicySection>

            {/* 11. Your Rights and Choices */}
            <PrivacyPolicySection id="your-rights" icon={Scale} title="Your Rights and Choices">
              <p>
                Depending on your location, you may have certain rights regarding your personal information. These may include:
              </p>
              <ul className="space-y-2">
                <Bullet title="Browser controls">Adjust privacy, cookie, and permission settings directly in your browser at any time</Bullet>
                <Bullet title="Cookie preferences">Manage or withdraw cookie consent through the banner on our website</Bullet>
                <Bullet title="Ad personalisation">Opt out of personalised ads through Google Ads Settings or industry opt-out tools</Bullet>
                <Bullet title="Permission revocation">Revoke camera, microphone, or other permissions through your browser's site settings</Bullet>
                <Bullet title="Contact us">Reach out with any privacy-related questions, concerns, or requests regarding your data</Bullet>
              </ul>
              <p className="text-sm">
                If you are located in the European Economic Area (EEA), United Kingdom, or another jurisdiction with data protection laws, you may also have the right to access, correct, or delete personal information, or to object to or restrict certain processing. Please contact us to exercise these rights.
              </p>
            </PrivacyPolicySection>

            {/* 12. International Users */}
            <PrivacyPolicySection id="international" icon={Plane} title="International Users">
              <p>
                Laptop Analyzer is accessible to users worldwide. If you access our website from outside the country where our services and infrastructure are hosted, please be aware that information collected by third-party services may be transferred to and processed in countries other than your own.
              </p>
              <p>
                By using our website, you acknowledge that your information may be processed in jurisdictions with different data protection laws. We endeavour to ensure appropriate safeguards are in place wherever your information is processed.
              </p>
            </PrivacyPolicySection>

            {/* 13. Changes to This Policy */}
            <PrivacyPolicySection id="changes" icon={RefreshCw} title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, services, or applicable laws. When we make changes, we will revise the "Last updated" date at the top of this page.
              </p>
              <p>
                We encourage you to review this policy periodically. Your continued use of Laptop Analyzer after any changes constitutes your acceptance of the updated policy.
              </p>
            </PrivacyPolicySection>

            {/* 14. Contact Us */}
            <PrivacyPolicySection id="contact" icon={Mail} title="Contact Us" highlight>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="rounded-xl bg-muted/30 border border-border p-5">
                <p className="text-foreground font-semibold mb-1">Laptop Analyzer — Privacy Inquiries</p>
                <a href="mailto:support@laptopanalyzer.com" className="text-primary hover:underline font-medium">
                  support@laptopanalyzer.com
                </a>
                <p className="text-sm mt-3">
                  We aim to respond to all privacy-related inquiries within 5 business days.
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
