'use client';

import { Navigation } from '@/components/layout/landing-navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cookie, FileText, Shield, CheckCircle, 
  Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="glassmorphism px-4 py-2 mb-8">
                <Cookie className="w-4 h-4 mr-2" />
                Transparency
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Cookie Policy
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                This policy explains how Resonance uses cookies and similar technologies to recognize you when you visit our website and application.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-xl">
              <CardContent className="p-8 md:p-12 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Last Updated: December 24, 2025
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This Cookie Policy explains how Resonance ("we", "our", or "us") uses cookies and similar technologies to recognize you when you visit our website and application (collectively, "Services"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Cookie className="w-5 h-5 mr-2 text-purple-600" />
                    What Are Cookies?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cookies set by the website owner (in this case, Resonance) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Why Do We Use Cookies?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Services to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Services. Third parties serve cookies through our Services for analytics and other purposes.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    The specific types of first and third-party cookies served through our Services and the purposes they perform are described below:
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Types of Cookies We Use
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        These cookies are strictly necessary to provide you with services available through our Services and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Services, you cannot refuse them without impacting how our Services function.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Performance and Functionality Cookies</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        These cookies are used to enhance the performance and functionality of our Services but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Analytics and Customization Cookies</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        These cookies collect information that is used either in aggregate form to help us understand how our Services are being used or how effective our marketing campaigns are, or to help us customize our Services for you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    How Can You Control Cookies?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner that appears when you first visit our website.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Services though your access to some functionality and areas may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" className="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" className="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">http://www.youronlinechoices.com</a>.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Cookies We Use
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">session</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Used to maintain your session state</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Session</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Essential</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">auth-token</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Used to authenticate users</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">30 days</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Essential</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">theme-preference</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Stores your theme preference</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">1 year</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Functionality</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">_ga</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Google Analytics</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">2 years</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">Analytics</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    What About Other Tracking Technologies?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Services. This allows us, for example, to monitor the traffic patterns of users from one page within our Services to another, to deliver or communicate with cookies, to understand whether you have come to our Services from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Do You Use Flash Cookies or Local Shared Objects?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our Services may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" className="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">Website Storage Settings Panel</a>. You can also control Flash Cookies by going to the <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html" className=\"text-purple-600 dark:text-purple-400 hover:underline" target=\"_blank" rel="noopener noreferrer">Global Storage Settings Panel</a> and following the instructions.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Do You Serve Targeted Advertising?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We do not serve targeted advertising on our Services. However, third parties may serve cookies on your computer or mobile device to serve advertising through our Services. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. This can be accomplished by them using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    How Often Will You Update This Cookie Policy?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    The date at the top of this Cookie Policy indicates when it was last updated.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Where Can I Get Further Information?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    If you have any questions about our use of cookies or other technologies, please email us at privacy@resonance.ai or use the contact information below:
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      Email: privacy@resonance.ai<br />
                      Address: 123 Mental Health Avenue, Nairobi, Kenya<br />
                      Phone: +254 700 000 000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Card className="glassmorphism border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
              <CardContent className="relative px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Your mental health journey awaits
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Join Resonance today and discover a new way to understand and improve your emotional wellbeing.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/auth/signup">
                      <button className="rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Start Free Today
                        <ArrowRight className="ml-2 h-5 w-5 inline" />
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}