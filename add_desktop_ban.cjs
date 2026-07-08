const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const target = `                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(isBengali ? "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে মুছে ফেলতে চান?" : "Are you sure you want to delete this user?")) {
                                    onDeleteUser(user.email);
                                  }
                                }}`;

const replacement = `                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(isBengali ? (isSuspended ? "সাসপেন্ড তুলে নিতে চান?" : "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে সাসপেন্ড করতে চান?") : (isSuspended ? "Unsuspend user?" : "Suspend this user?"))) {
                                    if (onToggleSuspendUser) onToggleSuspendUser(user.email);
                                  }
                                }}
                                className={\`inline-flex items-center justify-center p-1.5 rounded-lg border transition-colors cursor-pointer \${isSuspended ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}\`}
                                title={isBengali ? (isSuspended ? "সাসপেন্ড বাতিল করুন" : "সাসপেন্ড করুন") : (isSuspended ? "Unsuspend" : "Suspend")}
                              >
                                {isSuspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(isBengali ? "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে মুছে ফেলতে চান?" : "Are you sure you want to delete this user?")) {
                                    onDeleteUser(user.email);
                                  }
                                }}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Added desktop ban button');
