"use client";
import React from "react";
import { useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";

export default function App() {
  return (
    <div className="flex w-full flex-col items-center pt-10">
      <Tabs aria-label="Options">
        <Tab key="subscription" title="Subscription">
          <Card>
            <CardBody>
              <Button
                color="success"
                onClick={() => {
                  /* Upgrade to Pro logic here */
                }}
              >
                Upgrade to Pro
              </Button>
              <div className="py-2" />
              <Button
                color="danger"
                onClick={() => {
                  /* Downgrade to Free logic here */
                }}
              >
                Downgrade to Free
              </Button>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="terms" title="Terms">
          <Card className="overflow-auto h-screen-50 w-screen-50">
            <CardBody>
              <p className="pb-5">
                <b>1. Introduction Welcome to PocketPR!</b>
                <br /> This User Agreement (&quot;Agreement&quot;) governs your
                use of the PocketPR application (&quot;App&quot;). By accessing
                or using the App, you agree to be bound by the terms of this
                Agreement. If you do not agree with these terms, please do not
                use the App.
              </p>
              <p>
                <b>2. User Conduct</b>
                <br /> You agree not to use the App to:
                <br />
                a) Engage in or promote any illegal activities. <br />
                b) Transmit or post any content that is violent, offensive,
                racist, discriminatory, hateful, or otherwise objectionable.{" "}
                <br />
                c) Harass, threaten, or defame any person or entity.
                <br />
                d) Transmit or post any content that infringes upon the rights
                of others, including intellectual property rights.
                <br /> e) Engage in any activity that disrupts or interferes
                with the proper working of the App.
              </p>
              <p className="pt-5">
                <b>3. Chat Messages</b> <br />
                a) All chat messages exchanged with the App&lsquo;s chatbot are
                saved by PocketPR. <br />
                b) Saved chat messages are used for the purpose of improving and
                training future models. <br />
                c) All saved chat messages are anonymized to protect user
                privacy. Personal identifiers are removed to ensure that
                individual users cannot be identified from the saved data.
              </p>
              <p className="pt-5">
                <b> 4. Privacy </b>
                <br /> Your privacy is important to us. Please review our
                Privacy Policy, which is incorporated into this Agreement by
                reference, to understand how we collect, use, and disclose
                information.
              </p>
              <p className="pt-5">
                <b> 5. Termination </b> <br />
                PocketPR reserves the right to terminate or suspend your access
                to the App without prior notice if you violate any terms of this
                Agreement or for any other reason at our sole discretion.
              </p>
              <p className="pt-5">
                <b> 6. Disclaimers </b>
                <br />
                The App is provided &quot;as is&quot; and without warranties of
                any kind, either express or implied. PocketPR disclaims all
                warranties, express or implied, including, but not limited to,
                implied warranties of merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>
              <p className="pt-5">
                <b>7. Limitation of Liability </b>
                <br /> To the fullest extent permitted by applicable law,
                PocketPR shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of
                profits or revenues, whether incurred directly or indirectly, or
                any loss of data, use, goodwill, or other intangible losses,
                resulting from your use or inability to use the App.
              </p>
              <p className="pt-5">
                <b>8. Changes to Agreement </b>
                <br />
                PocketPR reserves the right to modify this Agreement at any
                time. Changes will be effective immediately upon posting. Your
                continued use of the App after changes are posted constitutes
                your acceptance of the revised Agreement.
              </p>
              <p className="pt-5">
                <b>9. Governing Law </b>
                <br /> This Agreement is governed by the laws of the
                jurisdiction in which PocketPR is based, without regard to its
                conflict of law provisions.
              </p>
              <p className="pt-5">
                <b>10. Contact</b>
                <br />
                For any questions or concerns regarding this Agreement, please
                contact us at <u>help@pocketpr.com</u>. <br />
                By using the PocketPR App, you acknowledge that you have read,
                understood, and agree to be bound by the terms of this User
                Agreement.
              </p>
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
