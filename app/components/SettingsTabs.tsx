"use client";
import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const handleCheckout = async () => {
    console.log("to checkout...");

    try {
      const res = await fetch("/api/checkout");

      const data = await res.json();

      router.replace(data.sessionUrl);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex w-full flex-col items-center pt-10">
      <Tabs aria-label="Options" size="lg">
        <Tab key="subscription" title="Subscription">
          <Card>
            <CardBody>
              <Button
                className="bg-gradient-to-tr from-blue-400 to-yellow-500 text-black shadow-lg text-lg"
                onPress={handleCheckout}
              >
                Upgrade to Pro
              </Button>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="terms" title="Terms">
          <Card className="mx-4">
            <CardBody className="bg-black">
              <article className="prose lg:prose-xl p-12 text-white">
                <h1 className="pb-4 font-black text-2xl">User Agreement</h1>
                <ol>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Welcome to PocketPR!
                    </h2>
                    <p>
                      This User Agreement (&quot;Agreement&quot;) governs your
                      use of the PocketPR application (&quot;App&quot;). By
                      accessing or using the App, you agree to be bound by the
                      terms of this Agreement. If you do not agree with these
                      terms, please do not use the App.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      User Conduct
                    </h2>
                    <p>You agree not to use the App to:</p>
                    <ul>
                      <li>Engage in or promote any illegal activities.</li>
                      <li>
                        Transmit or post any content that is violent, offensive,
                        racist, discriminatory, hateful, or otherwise
                        objectionable.
                      </li>
                      <li>Harass, threaten, or defame any person or entity.</li>
                      <li>
                        Transmit or post any content that infringes upon the
                        rights of others, including intellectual property
                        rights.
                      </li>
                      <li>
                        Engage in any activity that disrupts or interferes with
                        the proper working of the App.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Chat Messages
                    </h2>
                    <ul>
                      <li>
                        All chat messages exchanged with the App&quot;s chatbot
                        are saved by PocketPR.
                      </li>
                      <li>
                        Saved chat messages are used for the purpose of
                        improving and training future models.
                      </li>
                      <li>
                        All saved chat messages are anonymized to protect user
                        privacy. Personal identifiers are removed to ensure that
                        individual users cannot be identified from the saved
                        data.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Privacy
                    </h2>
                    <p>
                      Your privacy is important to us. Please review our Privacy
                      Policy, which is incorporated into this Agreement by
                      reference, to understand how we collect, use, and disclose
                      information.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Termination
                    </h2>
                    <p>
                      PocketPR reserves the right to terminate or suspend your
                      access to the App without prior notice if you violate any
                      terms of this Agreement or for any other reason at our
                      sole discretion.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Disclaimers
                    </h2>
                    <p>
                      The App is provided &quot;as is&quot; and without
                      warranties of any kind, either express or implied.
                      PocketPR disclaims all warranties, express or implied,
                      including, but not limited to, implied warranties of
                      merchantability, fitness for a particular purpose, and
                      non-infringement.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Limitation of Liability
                    </h2>
                    <p>
                      To the fullest extent permitted by applicable law,
                      PocketPR shall not be liable for any indirect, incidental,
                      special, consequential, or punitive damages, or any loss
                      of profits or revenues, whether incurred directly or
                      indirectly, or any loss of data, use, goodwill, or other
                      intangible losses, resulting from your use or inability to
                      use the App.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Changes to Agreement
                    </h2>
                    <p>
                      PocketPR reserves the right to modify this Agreement at
                      any time. Changes will be effective immediately upon
                      posting. Your continued use of the App after changes are
                      posted constitutes your acceptance of the revised
                      Agreement.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Governing Law
                    </h2>
                    <p>
                      This Agreement is governed by the laws of the jurisdiction
                      in which PocketPR is based, without regard to its conflict
                      of law provisions.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Contact
                    </h2>
                    <p>
                      For any questions or concerns regarding this Agreement,
                      please contact us at
                      <a href="mailto:help@pocketpr.app">help@pocketpr.app</a>.
                      By using the PocketPR App, you acknowledge that you have
                      read, understood, and agree to be bound by the terms of
                      this User Agreement.
                    </p>
                  </li>
                </ol>

                <h1 className="pt-12 pb-4 font-black text-2xl">
                  Privacy Policy
                </h1>
                <ol>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Introduction
                    </h2>
                    <p>
                      Thank you for using the PocketPR application
                      (&quot;App&quot;). Your privacy is of utmost importance to
                      us. This Privacy Policy describes how PocketPR collects,
                      uses, and protects your information. By accessing or using
                      the App, you agree to this Privacy Policy in addition to
                      the User Agreement. If there&quot;s any inconsistency
                      between this Privacy Policy and the User Agreement, this
                      Privacy Policy will prevail.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Information Collection
                    </h2>
                    <p>When you use the App, we collect:</p>
                    <ul>
                      <li>
                        Chat messages exchanged with the App&quot;s chatbot.
                      </li>
                      <li>
                        Basic usage data like frequency, duration, and features
                        accessed.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Use of Information
                    </h2>
                    <p>We use the collected information for:</p>
                    <ul>
                      <li>
                        Improving the App&quot;s performance and features.
                      </li>
                      <li>Training and improving future models.</li>
                      <li>
                        Understanding user behavior and preferences to enhance
                        user experience.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Data Anonymization
                    </h2>
                    <p>
                      All chat messages exchanged with the App&quot;s chatbot
                      are stored in an anonymized manner. We remove all personal
                      identifiers to ensure that individual users cannot be
                      identified from the saved data.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Data Sharing and Disclosure
                    </h2>
                    <p>
                      We do not sell, trade, or rent your personal data to third
                      parties. We may share anonymized and aggregated
                      information with third-party partners for research and
                      development purposes.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Data Protection
                    </h2>
                    <p>
                      We use appropriate security measures to protect the
                      information we collect and store. While no system is
                      completely secure, we strive to protect your data from
                      unauthorized access, use, or disclosure.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Children&apos;s Privacy
                    </h2>
                    <p>
                      The App is not intended for use by children under the age
                      of 16. We do not knowingly collect or solicit personal
                      information from anyone under the age of 16. If you are a
                      parent or guardian and you believe your child has provided
                      us with personal information, please contact us at{" "}
                      <a href="mailto:help@pocketpr.app">help@pocketpr.app</a>.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Changes to Privacy Policy
                    </h2>
                    <p>
                      From time to time, we may update this Privacy Policy. We
                      encourage you to review it periodically. By continuing to
                      use the App after any changes, you are expressing your
                      acceptance of the updated policy.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Your Rights
                    </h2>
                    <p>You have the right to:</p>
                    <ul>
                      <li>Access your personal data.</li>
                      <li>
                        Request correction or deletion of your personal data.
                      </li>
                      <li>Object to the processing of your personal data.</li>
                      <li>Request data portability.</li>
                    </ul>
                    <p>
                      If you wish to exercise any of these rights, please
                      contact us at{" "}
                      <a href="mailto:help@pocketpr.app">help@pocketpr.app</a>.
                    </p>
                  </li>
                  <li>
                    <h2 className="font-bold text-xl pt-4 pb-1 underline">
                      Contact Information
                    </h2>
                    <p>
                      If you have any questions or concerns regarding this
                      Privacy Policy or our data practices, please reach out to
                      us: Email:{" "}
                      <a href="mailto:help@pocketpr.app">help@pocketpr.app</a>.
                      By using the PocketPR App, you acknowledge that you have
                      read, understood, and agree to this Privacy Policy.
                    </p>
                  </li>
                </ol>
              </article>
            </CardBody>
          </Card>
        </Tab>
        {/* <Tab key="account" title="Account">
          <Card>
            <CardBody>
              <RadioGroup
                isRequired
                description="Opt-in or out of data training."
                label="Select Data Preference"
              >
                <Radio value="agree">Agree</Radio>
                <Radio value="disagree">Disagree</Radio>
              </RadioGroup>
              <div className="py-1" />
              <Button color="success">Save</Button>
            </CardBody>
          </Card>
        </Tab> */}
      </Tabs>
    </div>
  );
}
