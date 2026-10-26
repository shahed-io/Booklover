import { Truck, Mail, Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import PolicyLayout, { SectionCard, Bullet, ContactCard } from '@/components/store/PolicyLayout';

const A = 'hsl(258,78%,55%)';
const B = 'hsl(200,90%,45%)';

const DeliveryInfo = () => (
  <PolicyLayout
    seoTitle="Delivery Info — Relaxo Bean Bag"
    seoDesc="Relaxo Bean Bag ডেলিভারি প্রক্রিয়া, সময়সীমা ও পদ্ধতি জানুন। ঢাকায় ১–৩ দিন, ঢাকার বাইরে ৩–৫ দিনের মধ্যে হোম ডেলিভারি।"
    badge="Home Delivery"
    badgeIcon={<Truck size={13} />}
    title="Delivery Info"
    subtitle="আমরা সারা বাংলাদেশে কুরিয়ারের মাধ্যমে হোম ডেলিভারি প্রদান করি, সাথে ক্যাশ অন ডেলিভারি সুবিধা।"
    accentFrom={A}
    accentTo={B}
  >
    {/* Delivery time cards */}
    <div className="grid sm:grid-cols-3 gap-3 mb-6">
      {[
        { icon: '🚚', time: '১–৩ দিন', label: 'ঢাকার ভিতরে', color: 'hsl(142,72%,38%)' },
        { icon: '📦', time: '৩–৫ দিন', label: 'ঢাকার বাইরে', color: 'hsl(38,100%,45%)' },
        { icon: '🏠', time: 'সঙ্গে সেটআপ', label: 'হোম অ্যাসেম্বলি সহায়তা', color: A },
      ].map(card => (
        <div key={card.label} className="rounded-2xl p-4 text-center"
          style={{
            background: 'linear-gradient(155deg, rgba(255,255,255,0.70), rgba(255,255,255,0.45))',
            backdropFilter: 'blur(16px)',
            border: `1px solid hsla(258,78%,75%,0.22)`,
          }}>
          <div className="text-2xl mb-1">{card.icon}</div>
          <p className="font-sora font-black text-[15px]" style={{ color: card.color }}>{card.time}</p>
          <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'hsl(226,25%,50%)' }}>{card.label}</p>
        </div>
      ))}
    </div>

    {/* Important notice */}
    <div className="rounded-2xl p-4 mb-6 flex items-start gap-3"
      style={{ background: 'hsla(258,78%,55%,0.07)', border: '1.5px solid hsla(258,78%,55%,0.22)' }}>
      <Clock size={18} style={{ color: A, flexShrink: 0, marginTop: 2 }} />
      <div>
        <p className="font-bold text-[13px] mb-1" style={{ color: 'hsl(226,35%,14%)' }}>ডেলিভারি সময় সম্পর্কে গুরুত্বপূর্ণ তথ্য</p>
        <p className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(226,25%,40%)' }}>
          অর্ডার কনফার্ম হওয়ার পর <strong>ঢাকার ভিতরে ১–৩ কার্যদিবস এবং ঢাকার বাইরে ৩–৫ কার্যদিবসের মধ্যে</strong> কুরিয়ারের মাধ্যমে পণ্য পৌঁছে দেওয়া হয়। প্যাকেজিং, ফ্যাব্রিক বা সেলাইয়ে কোনো সমস্যা থাকলে সমাধানের জন্য <strong>সর্বোচ্চ ৩ কর্মদিবস</strong> সময় লাগতে পারে। গ্রাহক অর্ডারের মাধ্যমে এই শর্তে সম্মতি প্রদান করছেন।
        </p>
      </div>
    </div>

    <SectionCard icon={<Mail size={15} />} title="১. ডেলিভারি পদ্ধতি" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet><strong>কুরিয়ার ডেলিভারি:</strong> স্টেডফাস্ট, পাঠাও বা রেডেক্স-এর মাধ্যমে সরাসরি বাসায় পৌঁছানো</Bullet>
        <Bullet><strong>ক্যাশ অন ডেলিভারি:</strong> পণ্য হাতে পেয়ে টাকা পরিশোধ করার সুবিধা</Bullet>
        <Bullet><strong>WhatsApp আপডেট:</strong> ডেলিভারি স্ট্যাটাস সরাসরি WhatsApp-এ জানানো হয়</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<Package size={15} />} title="২. পণ্য অনুযায়ী আনুমানিক ডেলিভারি সময়" accentFrom={A} accentTo={B}>
      <div className="space-y-2">
        {[
          { name: 'বিন ব্যাগ (সব সাইজ)', delivery: 'কুরিয়ার হোম ডেলিভারি', time: 'ঢাকা: ১–৩ দিন' },
          { name: 'সোফা / লাউঞ্জ চেয়ার', delivery: 'কুরিয়ার + সেটআপ গাইড', time: 'ঢাকার বাইরে: ৩–৫ দিন' },
          { name: 'কুশন ও ফোম রিফিল', delivery: 'কুরিয়ার হোম ডেলিভারি', time: 'ঢাকা: ১–৩ দিন' },
          { name: 'কভার (ধোয়া যায় এমন ফ্যাব্রিক)', delivery: 'কুরিয়ার হোম ডেলিভারি', time: 'ঢাকা: ১–৩ দিন' },
          { name: 'বড় ফার্নিচার অর্ডার', delivery: 'কুরিয়ার + সহায়তা', time: 'ঢাকার বাইরে: ৩–৫ দিন' },
        ].map(item => (
          <div key={item.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: 'hsla(258,78%,55%,0.05)', border: '1px solid hsla(258,78%,55%,0.10)' }}>
            <div className="flex-1">
              <p className="font-semibold text-[12px]" style={{ color: 'hsl(226,35%,18%)' }}>{item.name}</p>
              <p className="text-[11px]" style={{ color: 'hsl(226,25%,50%)' }}>{item.delivery}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: `${A}12`, color: A }}>{item.time}</span>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard icon={<CheckCircle size={15} />} title="৩. ডেলিভারি পাওয়ার পর" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>প্যাকেজ খোলার সময় ফ্যাব্রিক, সেলাই ও ফোম/বিন ভরাট ভালোভাবে পরীক্ষা করুন</Bullet>
        <Bullet>কোনো ক্ষতি বা ভুল পণ্য পেলে <strong>৭ দিনের মধ্যে</strong> আমাদের জানান</Bullet>
        <Bullet>ইনভয়েস ও প্যাকেজিং কিছুদিন সংরক্ষণ করুন</Bullet>
        <Bullet>পণ্যের সাথে দেওয়া কেয়ার ইনস্ট্রাকশন অনুসরণ করুন</Bullet>
        <Bullet color="hsl(38,92%,38%)">ফ্যাব্রিক, সেলাই বা ফোম সংক্রান্ত কোনো সমস্যার সমাধানে সর্বোচ্চ <strong>৩ কর্মদিবস</strong> সময় প্রযোজ্য হতে পারে।</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<AlertTriangle size={15} />} title="৪. ডেলিভারি না পেলে" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>প্রথমে কুরিয়ার প্রতিষ্ঠানের ট্র্যাকিং নম্বর দিয়ে স্ট্যাটাস চেক করুন</Bullet>
        <Bullet>My Account → My Orders থেকে অর্ডার স্ট্যাটাস দেখুন</Bullet>
        <Bullet><strong>প্রত্যাশিত সময়ের বেশি হলে</strong> WhatsApp-এ অর্ডার নম্বর পাঠান</Bullet>
        <Bullet>ডেলিভারি ঠিকানা ও ফোন নম্বর সঠিক দেওয়া হয়েছে কিনা নিশ্চিত করুন</Bullet>
      </ul>
    </SectionCard>

    <ContactCard accentFrom={A} accentTo={B} />
  </PolicyLayout>
);

export default DeliveryInfo;
