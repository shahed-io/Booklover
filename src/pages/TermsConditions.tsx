import { FileText, ShoppingCart, CreditCard, Shield, AlertTriangle, Scale, RefreshCw } from 'lucide-react';
import PolicyLayout, { SectionCard, Bullet, ContactCard } from '@/components/store/PolicyLayout';

const A = 'hsl(258,78%,55%)';
const B = 'hsl(200,90%,45%)';

const TermsConditions = () => (
  <PolicyLayout
    seoTitle="Terms & Conditions — Booklover"
    seoDesc="Booklover থেকে বিন ব্যাগ ও ফার্নিচার কেনার শর্তাবলী পড়ুন।"
    badge="Legal Document"
    badgeIcon={<FileText size={13} />}
    title="Terms & Conditions"
    subtitle="Booklover ব্যবহার করার আগে এই শর্তাবলী মনোযোগ দিয়ে পড়ুন। সাইট ব্যবহার করলে আপনি এই শর্তগুলো মেনে নিচ্ছেন বলে ধরা হবে।"
    accentFrom={A}
    accentTo={B}
  >
    <div className="rounded-2xl p-4 mb-6 text-[13px] leading-relaxed"
      style={{ background: `linear-gradient(135deg, ${A}0d, ${B}08)`, border: `1px solid ${A}25`, color: 'hsl(226,35%,28%)' }}>
      এই Terms & Conditions Booklover এবং আপনার মধ্যে একটি আইনি চুক্তি। <strong>booklover.com.bd</strong>-এ প্রবেশ বা যেকোনো পরিষেবা ব্যবহারের মাধ্যমে আপনি এই শর্তগুলো মেনে নিচ্ছেন।
    </div>

    <SectionCard icon={<ShoppingCart size={15} />} title="১. পরিষেবার বিবরণ" accentFrom={A} accentTo={B}>
      <p className="mb-2">Booklover একটি প্রিমিয়াম হোম ও লাইফস্টাইল ফার্নিচার বিক্রয় প্ল্যাটফর্ম। আমরা বিক্রি করি:</p>
      <ul className="space-y-1.5">
        <Bullet>বিভিন্ন সাইজ ও ফ্যাব্রিকের বিন ব্যাগ</Bullet>
        <Bullet>সোফা ও লাউঞ্জ চেয়ার</Bullet>
        <Bullet>কুশন ও বিন ব্যাগ রিফিল সার্ভিস</Bullet>
        <Bullet>ধোয়া যায় এমন কভার ও অ্যাক্সেসরিজ</Bullet>
      </ul>
      <p className="mt-2">সকল পণ্য কুরিয়ারের মাধ্যমে সারা বাংলাদেশে হোম ডেলিভারি করা হয়, সাথে ক্যাশ অন ডেলিভারি সুবিধা।</p>
    </SectionCard>

    <SectionCard icon={<Shield size={15} />} title="২. অ্যাকাউন্ট ও ব্যবহারকারীর দায়িত্ব" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>আপনার বয়স কমপক্ষে ১৩ বছর হতে হবে</Bullet>
        <Bullet>অ্যাকাউন্টের নিরাপত্তার দায়িত্ব আপনার নিজের</Bullet>
        <Bullet>একজন ব্যক্তি একাধিক অ্যাকাউন্ট খুলতে পারবেন না</Bullet>
        <Bullet>মিথ্যা তথ্য দিয়ে অ্যাকাউন্ট খোলা নিষিদ্ধ</Bullet>
        <Bullet>সন্দেহজনক কার্যক্রম আমাদের জানানোর দায়িত্ব আপনার</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<CreditCard size={15} />} title="৩. মূল্য ও পেমেন্ট" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>সকল মূল্য বাংলাদেশি টাকায় (BDT) প্রদর্শিত হয়</Bullet>
        <Bullet>পেমেন্ট গ্রহণযোগ্য: BKash, Nagad, Rocket, উপায়, BKash Merchant</Bullet>
        <Bullet>অর্ডার কনফার্মেশনের আগে পেমেন্ট যাচাই করা হয়</Bullet>
        <Bullet>মূল্য পরিবর্তনের অধিকার আমরা সংরক্ষণ করি</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<FileText size={15} />} title="৪. পণ্য ডেলিভারি নীতি" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>অর্ডার কনফার্মের পর ঢাকায় ১–৩ কার্যদিবস, ঢাকার বাইরে ৩–৫ কার্যদিবসে ডেলিভারি</Bullet>
        <Bullet>ডেলিভারি কুরিয়ার সার্ভিসের মাধ্যমে বাসায় পৌঁছে দেওয়া হয়</Bullet>
        <Bullet>নির্দিষ্ট শর্ত সাপেক্ষে ক্যাশ অন ডেলিভারি ও ফ্রি ডেলিভারি অফার প্রযোজ্য হতে পারে</Bullet>
        <Bullet>ক্ষতিগ্রস্ত বা ভুল পণ্য ছাড়া, ব্যবহৃত পণ্য ফেরত দেওয়া যায় না</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<AlertTriangle size={15} />} title="৫. নিষিদ্ধ কার্যক্রম" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>ভুয়া অর্ডার বা ভুয়া ঠিকানা দিয়ে অর্ডার করা</Bullet>
        <Bullet>কুরিয়ার থেকে পণ্য গ্রহণ না করে বারবার রিটার্ন করা</Bullet>
        <Bullet>চার্জব্যাক বা জালিয়াতি পেমেন্টের মাধ্যমে পণ্য নেওয়া</Bullet>
        <Bullet>ওয়েবসাইট বা অর্ডার সিস্টেম অপব্যবহারের চেষ্টা করা</Bullet>
        <Bullet>ভুয়া রিভিউ বা স্প্যাম পোস্ট করা</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<Scale size={15} />} title="৬. দায় সীমা" accentFrom={A} accentTo={B}>
      <ul className="space-y-1.5">
        <Bullet>কুরিয়ার প্রতিষ্ঠানের কারণে সৃষ্ট বিলম্বের জন্য আমরা সীমিতভাবে দায়ী</Bullet>
        <Bullet>প্রাকৃতিক দুর্যোগ বা রাস্তার সমস্যাজনিত বিলম্বের জন্য আমরা দায়ী নই</Bullet>
        <Bullet>ব্যবহারকারীর ভুল যত্নের কারণে পণ্য নষ্ট হলে আমরা দায়ী নই</Bullet>
        <Bullet>সর্বোচ্চ দায় আপনার পেমেন্ট করা পরিমাণের মধ্যে সীমাবদ্ধ</Bullet>
      </ul>
    </SectionCard>

    <SectionCard icon={<RefreshCw size={15} />} title="৭. শর্তাবলী পরিবর্তন" accentFrom={A} accentTo={B}>
      <p>আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করতে পারি। পরিবর্তনের পরেও সাইট ব্যবহার অব্যাহত রাখলে আপনি নতুন শর্ত মেনে নিচ্ছেন বলে ধরা হবে। যেকোনো বিরোধ বাংলাদেশের প্রচলিত আইন অনুযায়ী নিষ্পত্তি হবে।</p>
    </SectionCard>

    <ContactCard accentFrom={A} accentTo={B} />
  </PolicyLayout>
);

export default TermsConditions;
