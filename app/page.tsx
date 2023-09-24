import { Image } from "@nextui-org/image";
import { Spacer } from "@nextui-org/spacer";
import "animate.css/animate.min.css";
import { CheckIcon } from "@heroicons/react/20/solid";
import LandingHero from "./components/LandingHero";
import { TbArrowsCross } from "react-icons/tb";
import { AiFillWechat } from "react-icons/ai";
import { DiGoogleAnalytics } from "react-icons/di";
import NavBar from "./components/NavBar";
import { BriefcaseIcon, FireIcon, CameraIcon } from "@heroicons/react/20/solid";

const features = [
  {
    name: "Content Creators",
    description:
      "Gain insights into your audience's preferences in order to tailor your content accordingly and address any potential disputes or misunderstandings that may arise, ensuring a harmonious relationship with your followers.",
    // href: '#',
    icon: CameraIcon,
  },
  {
    name: "Influencers",
    description:
      "Discern which brands resonate most with your audience. Guide your partnership choices and swiftly address any concerns or controversies that may emerge from affiliations with brands that might not align with your audience's values.",
    // href: '#',
    icon: FireIcon,
  },
  {
    name: "Businesses",
    description:
      "Access a real-time feedback mechanism. Stay attuned to customer sentiments and perceptions, enabling you to rapidly adapt and refine your products and services in response to the ever-evolving demands and expectations of your clientele.",
    // href: '#',
    icon: BriefcaseIcon,
  },
];

const includedFeatures = [
  "Unlimited video chats",
  "Private Discord+ access",
  "Primary access to new features",
  "1-on-1 founder support",
];

export default function Home() {
  const features2 = [
    {
      name: "Cross-Platform Context",
      description:
        "Currently, we're revolutionizing YouTube experiences. But that's just the beginning. Soon, PocketPR will integrate with various social networks, ensuring your PR assistant grasps your audience's nuances from every angle and platform.",
      icon: TbArrowsCross,
    },
    {
      name: "Chat-With-Your-Posts",
      description:
        "Engage with your assistant on specific posts and gather insights on the chatter, or take a broader view and discuss your entire channel's dynamics. With PocketPR, every detail is within your grasp.",
      icon: AiFillWechat,
    },
    {
      name: "Analytical Reports",
      description:
        "Anticipate a wave of insightful reports in our upcoming updates. Aimed at enhancing conversations, forecasting audience trends, and skyrocketing your success as a digital creator with PocketPR.",
      icon: DiGoogleAnalytics,
    },
  ];

  const hobbyFeatures = [
    "Chat with 1 video per week",
    "Sentiment Reports",
    "Conflict Detection Reports",
  ];
  const scaleFeatures = [
    "Chat with unlimited videos",
    "Platform-Growth Consultation",
    "Chat with your channel",
  ];
  const growthFeatures = [
    "Chat with 3 videos per week",
    "Sentiment & Conflict Mitigation Reports",
    "Chat with any YouTube video",
  ];

  const navigation = [
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen">
        <NavBar />
        {/* --------------------------------------HERO-------------------------------------- */}
        <LandingHero />
        {/* --------------------------------------TAG-------------------------------------- */}

        <div className="bg-green-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-white">
                Stay Ahead
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A Use-Case For You, Whoever You Are
              </p>
              <p className="mt-6 text-lg leading-8 text-white">
                PocketPR is a groundbreaking platform that will help anyone and
                everyone better understand their social communications.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                      <feature.icon
                        className="h-5 w-5 flex-none text-yellow-400"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-white">
                      <p className="flex-auto">{feature.description}</p>
                      {/* <p className="mt-6">
                        <a href={feature.href} className="text-sm font-semibold leading-6 text-orange-600">
                          Learn more <span aria-hidden="true">→</span>
                        </a>
                      </p> */}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* <div className="mx-auto max-w-7xl py-24 px-6 md:py-32 xl:px-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"> */}

        <div className="overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl py-24 px-6 md:py-32 xl:px-32">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="flex items-center">
                <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
                  <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                    <Image
                      src="/chat-screenshot.png"
                      alt="Product screenshot"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:pr-24">
                <div className="lg:max-w-lg">
                  <p className="font-playfair pt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                    Turn feedback into fame.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-black">
                    This is just the beginning of a central-hub for your
                    platform-growth. We aim to bring a robust understanding of
                    the entirety of your online presence in an effort to best
                    guide your decision making as a creator and
                    online-personality.
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-black lg:max-w-none">
                    {features2.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-black">
                          <feature.icon
                            className="absolute left-1 top-1 h-5 w-5 text-green-600"
                            aria-hidden="true"
                          />
                          {feature.name}
                        </dt>{" "}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 bg-white rounded-xl py-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Get Full Access Today
              </h2>
              <p className="mt-6 text-lg leading-8 text-black">
                Free users can chat with 1 video per week. If you&apos;re
                serious about YouTube, subscribe to get unlimited access to your
                agent.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <h3 className="text-2xl font-bold tracking-tight text-black">
                  Starter
                </h3>
                <p className="mt-6 text-base leading-7 text-black">
                  Starter subscribers have access to chat with unlimited videos
                  and get first access to new features as they are released.
                </p>
                <div className="pt-10 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-green-800">
                    What’s included
                  </h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div>
                <ul
                  role="list"
                  className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-black sm:grid-cols-2 sm:gap-6"
                >
                  {includedFeatures.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-green-800"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="text-base font-semibold text-black">
                      Monthly
                    </p>
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-black">
                        $20
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-black">
                        USD
                      </span>
                    </p>
                    <a
                      href="#"
                      className="mt-10 block w-full rounded-md bg-green-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                    >
                      Get access
                    </a>
                    <p className="mt-6 text-xs leading-5 text-black">
                      PocketPR is currently in Beta. Prices subject to change as
                      our feature set expands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-green-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="font-playfair text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Leave the noise 4 GPT.
                <br />
                <Spacer y={2} />
                Sign-up today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Today&apos;s glimpse is only the start. Sign up now for priority
                access to groundbreaking features and exclusive beta releases
                with PocketPR!
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="/sign-up"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Sign Up
                </a>
                <a
                  href="/sign-in"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Sign In <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Image
                src="/happykang.svg"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>

        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2023 ForEveryone.AI - All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
