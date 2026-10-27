import { Code, ShieldAlert, Users, Globe, Megaphone, ExternalLink, Monitor, Mail, Info, Palette, Wrench } from 'lucide-react';
import PolicyLayout, { SectionCard, Bullet } from '@/components/store/PolicyLayout';

const A = 'hsl(222,55%,22%)';
const B = 'hsl(35,92%,52%)';

const stats = [
  { icon: <Users size={16} />, value: '500+', label: 'সন্তুষ্ট গ্রাহক' },
  { icon: <Code size={16} />, value: '1000+', label: 'সম্পন্ন প্রজেক্ট' },
  { icon: <Monitor size={16} />, value: '10+', label: 'বছরের অভিজ্ঞতা' },
  { icon: <Globe size={16} />, value: '20+', label: 'দেশে সার্ভিস' },
];

const services = [
  { icon: <Code size={15} />, title: 'Web Development', desc: 'Business website, e-commerce এবং কাস্টম ওয়েব অ্যাপ্লিকেশন — দ্রুত, নিরাপদ ও SEO-ফ্রেন্ডলি।' },
  { icon: <Palette size={15} />, title: 'Graphics Design', desc: 'Logo, branding, social media creatives ও video editing — ব্র্যান্ডকে professional look দেয়।' },
  { icon: <Megaphone size={15} />, title: 'Digital Marketing', desc: 'Facebook Ads, Google Ads, SEO ও content marketing — ব্যবসাকে এগিয়ে নিয়ে যায়।' },
  { icon: <Wrench size={15} />, title: 'Website Maintenance', desc: 'Speed optimization, security ও regular backup — সাইট সবসময় চালু ও নিরাপদ থাকে।' },
];

const Developer = () => (
  <PolicyLayout
    seoTitle="Developer — Shahed IT | Booklover"
    seoDesc="Booklover ওয়েবসাইটটি ডিজাইন ও ডেভেলপ করেছে Shahed IT — বাংলাদেশের একটি বিশ্বস্ত প্রিমিয়াম আইটি এজেন্সি।"
    badge="Developer Spotlight"
    badgeIcon={<Code size={13} />}
    title="Developer Spotlight"
    subtitle="এই ওয়েবসাইটটি ডিজাইন ও ডেভেলপ করেছে Shahed IT"
    accentFrom={A}
    accentTo={B}
  >
    <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'hsl(226,25%,40%)' }}>
      Booklover ওয়েবসাইটটির সম্পূর্ণ ডিজাইন, ডেভেলপমেন্ট ও রক্ষণাবেক্ষণের দায়িত্বে রয়েছে <strong>Shahed IT</strong> — বাংলাদেশের একটি বিশ্বস্ত প্রিমিয়াম আইটি এজেন্সি, যারা দেশি-বিদেশি গ্রাহকদের জন্য উচ্চমানের ডিজিটাল সল্যুশন তৈরি করে আসছে।
    </p>

    {/* Disclaimer */}
    <div className="rounded-2xl p-4 mb-6 flex items-start gap-3"
      style={{ background: 'hsla(35,92%,52%,0.08)', border: '1.5px solid hsla(35,92%,52%,0.28)' }}>
      <ShieldAlert size={18} style={{ color: B, flexShrink: 0, marginTop: 2 }} />
      <div>
        <p className="font-bold text-[13px] mb-1" style={{ color: 'hsl(226,35%,14%)' }}>দায়িত্ব বিবৃতি / Disclaimer</p>
        <p className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(226,25%,40%)' }}>
          Shahed IT শুধুমাত্র এই ওয়েবসাইটটি প্রিমিয়ামভাবে ডিজাইন ও ডেভেলপ করছে। ডেভেলপার কোম্পানির সাথে ওয়েবসাইটের মালিক/প্রতিষ্ঠানের কোনো স্বত্ব, অংশীদারিত্ব বা ব্যবসায়িক সম্পর্ক নেই। সম্পূর্ণ মালিকানা, ব্যবস্থাপনা, পণ্য/সার্ভিস, লেনদেন এবং আইনি দায়িত্ব ওয়েবসাইটের প্রকৃত মালিক/প্রতিষ্ঠানের। ভবিষ্যতে ওয়েবসাইট থেকে যেকোনো ধরনের সমস্যা, অভিযোগ বা আইনি বিষয়ের জন্য ডেভেলপার কোম্পানি (<strong>Shahed IT</strong>) দায়ী থাকবে না।
        </p>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="rounded-2xl p-4 text-center"
          style={{
            background: 'linear-gradient(155deg, rgba(255,255,255,0.72), rgba(255,255,255,0.45))',
            backdropFilter: 'blur(16px)',
            border: '1px solid hsla(222,45%,30%,0.14)',
          }}>
          <div className="flex justify-center mb-1" style={{ color: B }}>{s.icon}</div>
          <p className="font-sora font-black text-[17px]" style={{ color: A }}>{s.value}</p>
          <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'hsl(226,25%,50%)' }}>{s.label}</p>
        </div>
      ))}
    </div>

    <SectionCard icon={<Info size={15} />} title="Shahed IT — কারা তারা?" accentFrom={A} accentTo={B}>
      <p className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(226,25%,40%)' }}>
        Shahed IT একটি বিশ্বস্ত ডিজিটাল সার্ভিস প্রদানকারী প্রতিষ্ঠান। তারা ওয়েব ডেভেলপমেন্ট, ই-কমার্স, ব্র্যান্ডিং, ডিজিটাল মার্কেটিং ও সফটওয়্যার সল্যুশন প্রদান করে। ১০ বছরের অধিক অভিজ্ঞতা, ১০০০+ সফল প্রজেক্ট এবং ২০+ দেশে সেবা প্রদানের ট্র্যাক রেকর্ড নিয়ে তারা দাঁড়িয়ে আছে বাংলাদেশের অগ্রণী আইটি এজেন্সিগুলোর কাতারে।
      </p>
    </SectionCard>

    <SectionCard icon={<Code size={15} />} title="তাদের সেবাসমূহ" accentFrom={A} accentTo={B}>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map(s => (
          <div key={s.title} className="rounded-xl p-3.5"
            style={{ background: 'hsla(222,45%,30%,0.04)', border: '1px solid hsla(222,45%,30%,0.10)' }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: A }}>
              {s.icon}
              <p className="font-bold text-[12.5px]">{s.title}</p>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(226,25%,45%)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard icon={<Users size={15} />} title="কেন Shahed IT?" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>১০০% স্বচ্ছ লেনদেন নিশ্চিত করা হয়</Bullet>
        <Bullet>দ্রুত ও সময়মতো ডেলিভারি</Bullet>
        <Bullet>গ্রাহক সন্তুষ্টি সর্বোচ্চ অগ্রাধিকার</Bullet>
        <Bullet>নিরাপদ ও নির্ভরযোগ্য সার্ভিস প্রদান</Bullet>
        <Bullet>সাশ্রয়ী মূল্যে মানসম্পন্ন ডিজিটাল সেবা</Bullet>
        <Bullet>২৪/৭ গ্রাহক সহায়তা ও সাপোর্ট</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<Monitor size={15} />} title="Booklover প্রজেক্ট সম্পর্কে" accentFrom={A} accentTo={B}>
      <p className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(226,25%,40%)' }}>
        Booklover একটি আধুনিক প্রিমিয়াম হোম ও লাইফস্টাইল ফার্নিচার ই-কমার্স প্ল্যাটফর্ম, যেখানে গ্রাহকরা সহজেই বিন ব্যাগ, সোফা ও হোম ডেকর পণ্য অর্ডার করতে পারেন। এই প্ল্যাটফর্মের পুরো UI/UX, frontend, backend, payment integration এবং admin panel — সবকিছুই Shahed IT টিমের নিজস্ব নকশা ও কোডিংয়ে তৈরি। মোবাইল-ফার্স্ট রেসপনসিভ ডিজাইন, দ্রুত লোডিং, নিরাপদ পেমেন্ট ফ্লো এবং ২৪/৭ সাপোর্ট সিস্টেম — প্রতিটি ফিচারই গ্রাহকের অভিজ্ঞতাকে সর্বোচ্চ গুরুত্ব দিয়ে তৈরি।
      </p>
    </SectionCard>

    {/* CTA */}
    <div className="rounded-2xl p-5 mt-2 text-center"
      style={{ background: `linear-gradient(140deg, ${A}, hsl(222,52%,32%))`, boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,0.14)' }}>
      <p className="font-sora font-black text-[15px] mb-1" style={{ color: 'hsl(0,0%,100%)' }}>আপনারও কি একটি ওয়েবসাইট দরকার?</p>
      <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: 'hsla(0,0%,100%,0.72)' }}>
        আপনার ব্যবসার জন্য একটি প্রিমিয়াম ওয়েবসাইট, ই-কমার্স স্টোর কিংবা কাস্টম সফটওয়্যার সল্যুশন তৈরি করতে চাইলে আজই Shahed IT-এর সাথে যোগাযোগ করুন।
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <a href="https://wa.me/88" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold transition-all hover:-translate-y-0.5"
          style={{ background: `linear-gradient(180deg, ${B}, hsl(35,90%,44%))`, color: 'hsl(222,60%,14%)' }}>
          <Mail size={12} /> Get a Quote
        </a>
        <a href="https://shahedit.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: 'hsla(0,0%,100%,0.10)', border: '1px solid hsla(0,0%,100%,0.22)', color: 'hsl(0,0%,100%)' }}>
          Visit Shahed IT <ExternalLink size={11} />
        </a>
      </div>
    </div>
  </PolicyLayout>
);

export default Developer;
