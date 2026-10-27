import { RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import PolicyLayout, { SectionCard, Bullet, ContactCard } from '@/components/store/PolicyLayout';

const A = 'hsl(258,78%,55%)';
const B = 'hsl(200,90%,45%)';

const ReturnPolicy = () => (
  <PolicyLayout
    seoTitle="Return Policy — Booklover"
    seoDesc="Booklover রিটার্ন পলিসি জানুন। ক্ষতিগ্রস্ত বা ভুল পণ্যের ক্ষেত্রে ৭ দিনের মধ্যে রিটার্নের নিয়ম।"
    badge="Return Guidelines"
    badgeIcon={<RotateCcw size={13} />}
    title="Return Policy"
    subtitle="ক্ষতিগ্রস্ত, ত্রুটিপূর্ণ বা ভুল পণ্যের ক্ষেত্রে আমাদের রিটার্ন নীতি স্বচ্ছভাবে জানুন।"
    accentFrom={A}
    accentTo={B}
  >
    {/* Warning banner */}
    <div className="rounded-2xl p-4 mb-6 flex items-start gap-3"
      style={{ background: 'hsla(38,100%,55%,0.08)', border: '1px solid hsla(38,100%,55%,0.25)' }}>
      <AlertTriangle size={18} style={{ color: 'hsl(38,100%,40%)', flexShrink: 0, marginTop: 2 }} />
      <p className="text-[13px] leading-relaxed" style={{ color: 'hsl(38,60%,26%)' }}>
        <strong>গুরুত্বপূর্ণ:</strong> পণ্য ব্যবহার শুরু করার পর সাধারণ পছন্দ পরিবর্তনের কারণে রিটার্ন গ্রহণযোগ্য নয়। তবে ক্ষতিগ্রস্ত বা ভুল পণ্যের ক্ষেত্রে ৭ দিনের মধ্যে আমরা রিটার্ন/বিনিময়ের ব্যবস্থা করি।
      </p>
    </div>

    <SectionCard icon={<CheckCircle size={15} />} title="১. রিটার্ন গ্রহণযোগ্য পরিস্থিতি" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet color="hsl(142,72%,38%)">প্যাকেজিং খোলার সময় সেলাই, ফ্যাব্রিক বা ফোমে উৎপাদনজনিত ত্রুটি পাওয়া গেলে</Bullet>
        <Bullet color="hsl(142,72%,38%)">ডেলিভার হওয়া পণ্য অর্ডারের সাইজ/রং/মডেলের সাথে না মিললে</Bullet>
        <Bullet color="hsl(142,72%,38%)">পরিবহনের সময় পণ্য ক্ষতিগ্রস্ত হয়ে পৌঁছালে</Bullet>
        <Bullet color="hsl(142,72%,38%)">স্টক সমস্যার কারণে সঠিক পণ্য দেওয়া সম্ভব না হলে</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<XCircle size={15} />} title="২. রিটার্ন গ্রহণযোগ্য নয় যখন" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet color="hsl(0,72%,43%)">পণ্য ব্যবহার করে ময়লা বা ক্ষতিগ্রস্ত করার পরে রিটার্ন চাইলে</Bullet>
        <Bullet color="hsl(0,72%,43%)">পণ্য পাওয়ার ৭ দিনের পরে অভিযোগ করলে</Bullet>
        <Bullet color="hsl(0,72%,43%)">"মন পরিবর্তন" বা ভুল সাইজ/রং নিজে বেছে নিলে</Bullet>
        <Bullet color="hsl(0,72%,43%)">স্বাভাবিক ব্যবহারজনিত ক্ষয় (wear & tear) এর ক্ষেত্রে</Bullet>
        <Bullet color="hsl(0,72%,43%)">কভার ভুলভাবে ধোয়ার কারণে ফ্যাব্রিক নষ্ট হলে</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<RotateCcw size={15} />} title="৩. বিকল্প সমাধান (রিটার্নের পরিবর্তে)" accentFrom={A} accentTo={B}>
      <div className="grid sm:grid-cols-2 gap-2.5 mt-1">
        {[
          { icon: '🔄', title: 'প্রতিস্থাপন', desc: 'নতুন ত্রুটিমুক্ত পণ্য সরবরাহ' },
          { icon: '🛠️', title: 'রিফিল/মেরামত সাপোর্ট', desc: 'বিন রিফিল বা সেলাই মেরামতে সহায়তা (সর্বোচ্চ ৩ কর্মদিবস)' },
          { icon: '💰', title: 'স্টোর ক্রেডিট', desc: 'পরবর্তী কেনাকাটায় ব্যবহারের জন্য ক্রেডিট' },
          { icon: '♻️', title: 'পণ্য বিনিময়', desc: 'সমতুল্য মূল্যের ভিন্ন সাইজ/রঙের পণ্যের সাথে বিনিময়' },
        ].map(item => (
          <div key={item.title} className="flex items-start gap-2.5 rounded-xl p-3"
            style={{ background: 'hsla(258,78%,55%,0.05)', border: '1px solid hsla(258,78%,55%,0.12)' }}>
            <span className="text-lg">{item.icon}</span>
            <div>
              <p className="font-bold text-[12px]" style={{ color: 'hsl(226,35%,18%)' }}>{item.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'hsl(226,25%,48%)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>

    <SectionCard icon={<Clock size={15} />} title="৪. রিটার্ন প্রক্রিয়া" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>পণ্য পাওয়ার <strong>৭ দিনের মধ্যে</strong> আমাদের জানান</Bullet>
        <Bullet>সমস্যার <strong>ছবি বা ভিডিও</strong> সহ অর্ডার নম্বর পাঠান</Bullet>
        <Bullet>আমাদের টিম <strong>৬ ঘণ্টার মধ্যে</strong> সাড়া দেবে</Bullet>
        <Bullet>যাচাইয়ের পরে পণ্য পিকআপ করে রিটার্ন, বিনিময় বা রিফান্ড প্রক্রিয়া শুরু হবে</Bullet>
        <Bullet>ফ্যাব্রিক/সেলাই/ফোম সমস্যার সমাধানে সর্বোচ্চ <strong>৩ কর্মদিবস</strong> সময় প্রযোজ্য হতে পারে</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<AlertTriangle size={15} />} title="৫. রিফান্ড শর্তাবলী" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet color="hsl(38,92%,38%)">
          <strong>BKash Online Payment রিফান্ড:</strong> ১–২৪ ঘণ্টার মধ্যে প্রদান করা হয়।
        </Bullet>
        <Bullet color="hsl(38,92%,38%)">
          <strong>Gateway রিফান্ড:</strong> তাদের শর্ত অনুযায়ী সাধারণত ৩–৭ কার্যদিবস সময় লাগে।
        </Bullet>
        <Bullet color="hsl(38,92%,38%)">
          <strong>ব্যাংক চার্জ:</strong> রিফান্ডের ক্ষেত্রে ব্যাংক কর্তৃক আরোপিত যেকোনো ফি বা চার্জ ক্রেতাকে বহন করতে হবে।
        </Bullet>
        <Bullet color="hsl(38,92%,38%)">
          <strong>১০% চার্জ:</strong> কাস্টমারের ইচ্ছাশক্তির পরিবর্তন সহ যেকোনো ধরনের রিফান্ডের জন্য গেটওয়ে, সার্ভিস ও ব্যাংক চার্জ বাবদ <strong>১০% কেটে</strong> বাকি টাকা ফেরত দেওয়া হবে।
        </Bullet>
      </ul>
    </SectionCard>

    <ContactCard accentFrom={A} accentTo={B} />
  </PolicyLayout>
);

export default ReturnPolicy;
